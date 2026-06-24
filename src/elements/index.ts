import type LogicFlow from "@logicflow/core";
import { registerEventNodes } from "./nodes/events";
import { registerTaskNodes } from "./nodes/tasks";
import { registerSequenceEdges } from "./edges/sequence";
import { registerGatewayNodes } from "./nodes/gateways";

/**
 * 初始化加载节点信息
 * @param lf LogicFlow示例
 */
export function initElements(lf: LogicFlow) {
    // 注册相关节点
    registerEventNodes(lf);
    registerTaskNodes(lf);
    registerSequenceEdges(lf);
    registerGatewayNodes(lf);
}
