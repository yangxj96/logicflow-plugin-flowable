import type LogicFlow from "@logicflow/core";
import { NODE_TYPES, PLUGIN_NAME } from "./constants";
import { registerContextMenu } from "../features/context-menu";
import { FlowablePluginOptions } from "./types";
import { registerDndPanel } from "../panel/dnd";
import { registerPropertyPanel } from "../panel/property";
import { initProcessContext } from "../features/context/process";
import { initElements } from "../elements";

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
    lf: LogicFlow;

    /**
     * 插件配置
     */
    options: FlowablePluginOptions;

    /**
     * 插件初始化
     * @param lf
     * @param options
     */
    constructor({ lf, options }: { lf: LogicFlow; options: FlowablePluginOptions }) {
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

    /**
     * 注册插件能力
     */
    private initPlugins() {
        registerContextMenu(this.lf);
    }

    /**
     * 默认配置
     */
    private initDefaultConfig() {
        this.lf.setDefaultEdgeType(NODE_TYPES.SEQUENCE_FLOW);
    }

    /**
     * 事件绑定
     */
    private bindEvents() {
        this.lf.on("graph:rendered", this.onGraphRendered);

        // 连线被拒绝时的提示
        this.lf.on("connection:not-allowed", ({ data, msg }) => {
            const name = data?.text?.value ?? data?.text ?? data?.type ?? "节点";
            console.warn(`[flowable] 连线到 "${name}" 被拒绝: ${msg}`);
        });
    }

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
        const { panel } = this.options;

        if (!panel) return;

        // DND面板
        if (panel.dnd) {
            registerDndPanel({
                lf: this.lf,
                container: panel.dnd
            });
        }
        // 属性面板
        if (panel.property) {
            registerPropertyPanel({
                lf: this.lf,
                container: panel.property
            });
        }
    }

    /**
     * 合并默认配置
     */
    private mergeOptions(options?: FlowablePluginOptions): Required<FlowablePluginOptions> {
        return {
            panel: {
                dnd: options?.panel?.dnd,
                property: options?.panel?.property
            }
        };
    }
}
