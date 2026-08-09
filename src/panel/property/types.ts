import type { LogicFlow } from "@logicflow/core";
import { ProcessModel } from "../../features/context/types";
import { PickerType } from "../../features/schema/types";
import { App, ComputedRef, Ref, VNode } from "vue";
import { FormInstance } from "element-plus";
import type { Property } from "../../features/schema/types";

/**
 * 初始化数据
 */
export interface PropertyPanelOptions {
    lf: LogicFlow;
    container: HTMLElement;
    pickers?: PickerType[];
}

/**
 * 属性面板state
 */
export interface PropertyPanelState {
    /**
     * LogicFlow实例
     */
    lf: LogicFlow;
    /**
     * 当前模式
     */
    mode: Ref<"node" | "edge" | "process">;
    /**
     * 流程属性
     */
    process: Ref<ProcessModel>;
    /**
     * 表单实例
     */
    formRef: Ref<FormInstance | undefined>;
    /**
     * 当前选中节点
     */
    currentNode: Ref<LogicFlow.NodeData | undefined>;
    /**
     * 当前选中线
     */
    currentEdge: Ref<LogicFlow.EdgeData | undefined>;
    /**
     * 表单唯一 key，切换选中元素时变化以强制重建表单
     */
    formKey: ComputedRef<string>;
    /**
     * 使用方已实现的选择器类型
     */
    pickers: PickerType[];
}

/**
 * 属性事件配置
 */
export interface PropertyEventOptions {
    lf: LogicFlow;
    app: App;
    state: PropertyPanelState;
}

/**
 * 属性渲染上下文
 */
export type PropertyRendererContext = {
    /**
     * 属性
     */
    property: Property;
    /**
     * 值
     */
    value: unknown;
};

/**
 * 属性渲染器
 */
export type PropertyRenderer = (ctx: PropertyRendererContext) => () => VNode;
