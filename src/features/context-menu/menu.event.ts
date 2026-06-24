import { ContextMenuItem } from "./types";

/**
 * node上下文菜单
 */
export const nodeMenu: ContextMenuItem[] = [
    {
        key: "delete",
        label: "删除节点",
        onClick: ({ lf, data }) => {
            lf.deleteNode(data.id);
        }
    }
];

/**
 * edge上下文菜单
 */
export const edgeMenu: ContextMenuItem[] = [
    {
        key: "default",
        label: "设置为默认流",
        onClick: ({ lf, data }) => {
            console.log("默认流", lf, data);
        }
    },
    {
        key: "delete",
        label: "删除顺序流",
        onClick: ({ lf, data }) => {
            lf.deleteEdge(data.id);
        }
    }
];
