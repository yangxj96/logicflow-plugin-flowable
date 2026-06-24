import type { LogicFlow } from "@logicflow/core";

/**
 * 初始化数据
 */
export interface DndPanelOptions {
    lf: LogicFlow;
    container: HTMLElement;
}

/**
 * DND状态
 */
export interface DndState {
    lf: LogicFlow;
    nodes: DndNodeMeta[];
}

/**
 * 节点元数据定义
 */
export interface DndNodeMeta {
    type: string;
    label: string;
    icon: string;
    group: string;
}
