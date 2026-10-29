import LogicFlowCore from "@logicflow/core";
import { DynamicGroup } from "@logicflow/extension";
import { NODE_TYPES, PLUGIN_NAME } from "./constants";
import { registerContextMenu } from "../features/context-menu";
import { type FlowablePluginOptions } from "./types";
import { registerDndPanel, type DndPanelHandle } from "../panel/dnd";
import { registerPropertyPanel, type PropertyPanelHandle } from "../panel/property";
import { initProcessContext } from "../features/context/process";
import { initElements } from "../elements";

type LogicFlowWithGraphModel = LogicFlowCore & {
    graphModel?: {
        editConfigModel?: {
            allowResize?: boolean;
        };
    };
};

/**
 * 插件注册
 */
export default class FlowablePlugin {
    /**
     * 插件名称
     */
    static pluginName = PLUGIN_NAME;

    /**
     * 插件实例
     */
    lf: LogicFlowCore;

    /**
     * 插件配置
     */
    options: FlowablePluginOptions;

    /**
     * 插件初始化
     * @param lf
     * @param options
     */
    constructor({ lf, options }: { lf: LogicFlowCore; options: FlowablePluginOptions }) {
        this.lf = lf;
        this.options = this.mergeOptions(options);
        this.init();
    }

    /**
     * 初始化插件
     * @private
     */
    private init(): void {
        this.initContext();
        this.initElements();
        this.initPlugins();
        this.initDefaultConfig();
        this.bindEvents();
    }

    /**
     * 初始化上下文
     */
    private initContext() {
        initProcessContext(this.lf);
    }

    /**
     * 注册节点
     */
    private initElements() {
        initElements(this.lf);
    }

    private dynamicGroupInstance?: DynamicGroup;

    /**
     * DND 面板句柄
     */
    private dndPanel?: DndPanelHandle;

    /**
     * 属性面板句柄
     */
    private propertyPanel?: PropertyPanelHandle;

    /**
     * 面板是否已经初始化
     */
    private panelsInitialized = false;

    /**
     * 插件是否已销毁
     */
    private destroyed = false;

    /**
     * 注册插件能力
     */
    private initPlugins() {
        registerContextMenu(this.lf);

        // 初始化 DynamicGroup 扩展（子流程容器支持）
        try {
            this.dynamicGroupInstance = new DynamicGroup({
                lf: this.lf,
                LogicFlow: LogicFlowCore,
                options: {}
            });
            // 禁用级联删除，避免删除节点时的无限递归
            this.dynamicGroupInstance.cascadeDeleteChildren = false;
            this.dynamicGroupInstance.init();
        } catch {
            // DynamicGroup 可能未安装
        }
    }

    /**
     * 默认配置
     */
    private initDefaultConfig() {
        this.lf.setDefaultEdgeType(NODE_TYPES.SEQUENCE_FLOW);

        // 启用节点缩放（子流程等容器节点需要缩放手柄）
        const graphModel = (this.lf as unknown as LogicFlowWithGraphModel).graphModel;
        if (graphModel?.editConfigModel) {
            graphModel.editConfigModel.allowResize = true;
        }
    }

    /**
     * 事件绑定
     */
    private bindEvents() {
        this.lf.on("graph:rendered", this.onGraphRendered);
        this.lf.on("connection:not-allowed", this.onConnectionNotAllowed);
    }

    /**
     * 连线被拒绝时的提示
     */
    private onConnectionNotAllowed = ({ data, msg }: { data?: { text?: unknown; type?: string }; msg?: string }) => {
        const text = data?.text;
        const name =
            typeof text === "string" ? text : ((text as { value?: string } | undefined)?.value ?? data?.type ?? "节点");
        console.warn(`[flowable] 连线到 "${name}" 被拒绝: ${msg}`);
    };

    /**
     * 渲染完成
     */
    private onGraphRendered = () => {
        this.initPanels();
    };

    /**
     * 初始化面板
     * @private
     */
    private initPanels() {
        if (this.destroyed || this.panelsInitialized) return;

        const { panel } = this.options;

        if (!panel) return;

        // DND面板
        if (panel.dnd) {
            this.dndPanel = registerDndPanel({
                lf: this.lf,
                container: panel.dnd
            });
        }
        // 属性面板
        if (panel.property) {
            this.propertyPanel = registerPropertyPanel({
                lf: this.lf,
                container: panel.property,
                pickers: this.options.pickers
            });
        }

        this.panelsInitialized = true;
    }

    /**
     * 同步待写入的表单，导出前调用
     */
    flush() {
        if (this.destroyed) return;
        this.propertyPanel?.flush();
    }

    /**
     * 释放插件资源，由 LogicFlow.destroy 调用
     */
    destroy() {
        if (this.destroyed) return;
        this.destroyed = true;

        this.propertyPanel?.dispose();
        this.propertyPanel = undefined;
        this.dndPanel?.dispose();
        this.dndPanel = undefined;

        try {
            this.dynamicGroupInstance?.destroy();
        } catch {
            // DynamicGroup 可能未安装
        }
        this.dynamicGroupInstance = undefined;

        this.lf.off("graph:rendered", this.onGraphRendered);
        this.lf.off("connection:not-allowed", this.onConnectionNotAllowed);
    }

    /**
     * 合并默认配置
     */
    private mergeOptions(options?: FlowablePluginOptions): Required<FlowablePluginOptions> {
        return {
            panel: {
                dnd: options?.panel?.dnd,
                property: options?.panel?.property
            },
            pickers: options?.pickers ?? []
        };
    }
}
