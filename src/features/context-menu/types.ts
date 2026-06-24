import type LogicFlow from "@logicflow/core";

/**
 * 上下文菜单Item
 */
export interface ContextMenuItem {
    key: string;
    label: string;
    icon?: string;
    show?: (ctx: MenuContext) => boolean;
    disabled?: (ctx: MenuContext) => boolean;
    onClick: (ctx: MenuContext) => void;
}

/**
 * 菜单上下文
 */
export interface MenuContext {
    lf: LogicFlow;
    type: "node" | "edge" | "blank";
    data?: any;
}

/**
 * 上下文菜单状态
 */
export interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
    ctx: MenuContext | null;
}
