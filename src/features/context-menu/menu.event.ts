import { ContextMenuItem } from "./types";

/**
 * node上下文菜单
 */
export const nodeMenu: ContextMenuItem[] = [
    {
        key: "delete",
        label: "删除节点",
        onClick: ({ lf, data }) => {
            const graphModel = (lf as any).graphModel;
            const dynamicGroup = (lf as any).extensions?.dynamicGroup;

            // 临时移除 node:delete 事件监听，避免 DynamicGroup 的递归调用
            if (dynamicGroup?.removeNodeFromGroup) {
                lf.off("node:delete", dynamicGroup.removeNodeFromGroup);
            }

            // 直接使用 graphModel.deleteNode，绕过 DynamicGroup 的重写
            graphModel.deleteNode(data.id);

            // 恢复事件监听
            if (dynamicGroup?.removeNodeFromGroup) {
                lf.on("node:delete", dynamicGroup.removeNodeFromGroup);
            }
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
