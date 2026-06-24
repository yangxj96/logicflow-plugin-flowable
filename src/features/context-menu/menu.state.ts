import { reactive } from "vue";
import { ContextMenuItem, ContextMenuState, MenuContext } from "./types";

/**
 * 上下文菜单状态
 */
export const contextMenuState = reactive({
    visible: false,
    x: 0,
    y: 0,
    items: [] as ContextMenuItem[],
    ctx: null as MenuContext | null
}) as unknown as ContextMenuState;

/**
 * 打开上下文菜单
 * @param e
 * @param items
 * @param ctx
 */
export function openContextMenu(e: MouseEvent, items: ContextMenuItem[], ctx: MenuContext) {
    contextMenuState.visible = true;
    contextMenuState.x = e.clientX;
    contextMenuState.y = e.clientY;
    contextMenuState.items = items;
    contextMenuState.ctx = ctx;
}

/**
 * 关闭上下文菜单
 */
export function closeContextMenu() {
    contextMenuState.visible = false;
    contextMenuState.ctx = null;
}
