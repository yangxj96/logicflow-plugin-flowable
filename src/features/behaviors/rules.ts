import type { BaseNodeModel } from "@logicflow/core";
import type { ConnectRule } from "@logicflow/core";
import type { NodeBehavior } from "./types";

/**
 * 从节点行为规则生成 LogicFlow ConnectRule 数组
 * 用于挂载到节点 model 的 sourceRules / targetRules
 */

/**
 * 创建"作为 source 时"的连接规则
 */
export function createSourceRules(behavior: NodeBehavior): ConnectRule[] {
    const rules: ConnectRule[] = [];

    if (!behavior.allowOut) {
        rules.push({
            message: `${behavior.type} 不允许作为连线起点`,
            validate: () => false
        });
        return rules;
    }

    // 限制目标节点类型
    if (behavior.allowTargetTypes && behavior.allowTargetTypes.length > 0) {
        rules.push({
            message: `${behavior.type} 不能连线到该类型节点`,
            validate: (_source, target) => {
                if (!target) return true; // 创建中目标未确定
                return behavior.allowTargetTypes!.includes(target.type);
            }
        });
    }

    // 限制最大出线数
    if (behavior.maxOut > 0) {
        rules.push({
            message: `${behavior.type} 最多只能连出 ${behavior.maxOut} 条线`,
            validate: source => {
                if (!source) return true;
                const outgoingCount = countOutgoing(source);
                // 创建新线时，当前 outgoingCount 还没包含新线，所以用 <
                return outgoingCount < behavior.maxOut;
            }
        });
    }

    // 防止重复连线
    rules.push({
        message: "两个节点之间已存在连线",
        validate: (source, target) => {
            if (!source || !target) return true;
            const graphModel = source.graphModel;
            const edges = graphModel.getNodeEdges(source.id);
            return !edges.some(e => e.sourceNodeId === source.id && e.targetNodeId === target.id);
        }
    });

    return rules;
}

/**
 * 创建"作为 target 时"的连接规则
 */
export function createTargetRules(behavior: NodeBehavior): ConnectRule[] {
    const rules: ConnectRule[] = [];

    if (!behavior.allowIn) {
        rules.push({
            message: `${behavior.type} 不允许作为连线终点`,
            validate: () => false
        });
        return rules;
    }

    // 限制来源节点类型
    if (behavior.allowSourceTypes && behavior.allowSourceTypes.length > 0) {
        rules.push({
            message: `该类型节点不能连线到 ${behavior.type}`,
            validate: (source, target) => {
                if (!source) return true;
                if (!target) return true;
                return behavior.allowSourceTypes!.includes(source.type);
            }
        });
    }

    // 限制最大入线数
    if (behavior.maxIn > 0) {
        rules.push({
            message: `${behavior.type} 最多只能连入 ${behavior.maxIn} 条线`,
            validate: (_source, target) => {
                if (!target) return true;
                const incomingCount = countIncoming(target);
                return incomingCount < behavior.maxIn;
            }
        });
    }

    return rules;
}

/**
 * 创建一个同时包含 source 和 target 规则的完整规则集
 */
export function createConnectRules(behavior: NodeBehavior): {
    sourceRules: ConnectRule[];
    targetRules: ConnectRule[];
} {
    return {
        sourceRules: createSourceRules(behavior),
        targetRules: createTargetRules(behavior)
    };
}

/**
 * 统计节点的出线数量
 */
function countOutgoing(node: BaseNodeModel): number {
    const graphModel = node.graphModel;
    if (!graphModel) return 0;
    const edges = graphModel.getNodeEdges(node.id);
    return edges.filter(e => e.sourceNodeId === node.id).length;
}

/**
 * 统计节点的入线数量
 */
function countIncoming(node: BaseNodeModel): number {
    const graphModel = node.graphModel;
    if (!graphModel) return 0;
    const edges = graphModel.getNodeEdges(node.id);
    return edges.filter(e => e.targetNodeId === node.id).length;
}
