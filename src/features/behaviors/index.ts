import { NODE_TYPES } from "../../core/constants";
import type { NodeBehavior } from "./types";

/**
 * BPMN 2.0 节点行为规则注册表
 *
 * 基于 document/NodeBehaviors.md 定义的规则：
 * - 连线创建阶段：校验拓扑与类型合法性（allowOut/allowIn/maxOut/maxIn/allowTargetTypes/allowSourceTypes）
 * - 全流程校验阶段：校验 minIn/minOut 等完整性约束（后续实现）
 */
export const NODE_BEHAVIORS: Record<string, NodeBehavior> = {
    /* ========== 事件 ========== */

    [NODE_TYPES.START_EVENT]: {
        type: "开始事件",
        allowOut: true,
        allowIn: false,
        minOut: 1,
        maxOut: 1,
        minIn: 0,
        maxIn: 0
    },

    [NODE_TYPES.END_EVENT]: {
        type: "结束事件",
        allowOut: false,
        allowIn: true,
        minOut: 0,
        maxOut: 0,
        minIn: 1,
        maxIn: 99
    },

    [NODE_TYPES.INTERMEDIATE_CATCH_EVENT]: {
        type: "中间捕获事件",
        allowOut: true,
        allowIn: true,
        minOut: 1,
        maxOut: 99,
        minIn: 1,
        maxIn: 99
    },

    [NODE_TYPES.INTERMEDIATE_THROW_EVENT]: {
        type: "中间抛出事件",
        allowOut: true,
        allowIn: true,
        minOut: 1,
        maxOut: 99,
        minIn: 1,
        maxIn: 99
    },

    [NODE_TYPES.BOUNDARY_EVENT]: {
        type: "边界事件",
        allowOut: true,
        allowIn: false,
        minOut: 1,
        maxOut: 99,
        minIn: 0,
        maxIn: 0
    },

    /* ========== 子流程与调用 ========== */

    [NODE_TYPES.SUB_PROCESS]: {
        type: "嵌入式子流程",
        allowOut: true,
        allowIn: true,
        minOut: 1,
        maxOut: 99,
        minIn: 1,
        maxIn: 99
    },

    [NODE_TYPES.CALL_ACTIVITY]: {
        type: "调用活动",
        allowOut: true,
        allowIn: true,
        minOut: 1,
        maxOut: 1,
        minIn: 1,
        maxIn: 99
    },

    /* ========== 任务 ========== */

    [NODE_TYPES.USER_TASK]: {
        type: "用户任务",
        allowOut: true,
        allowIn: true,
        minOut: 1,
        maxOut: 1,
        minIn: 1,
        maxIn: 99
    },

    [NODE_TYPES.SERVICE_TASK]: {
        type: "服务任务",
        allowOut: true,
        allowIn: true,
        minOut: 1,
        maxOut: 1,
        minIn: 1,
        maxIn: 99
    },

    [NODE_TYPES.SCRIPT_TASK]: {
        type: "脚本任务",
        allowOut: true,
        allowIn: true,
        minOut: 1,
        maxOut: 1,
        minIn: 1,
        maxIn: 99
    },

    [NODE_TYPES.RECEIVE_TASK]: {
        type: "接收任务",
        allowOut: true,
        allowIn: true,
        minOut: 0, // 允许无出线（流程可暂停）
        maxOut: 1,
        minIn: 1,
        maxIn: 99
    },

    /* ========== 网关 ========== */

    [NODE_TYPES.EXCLUSIVE_GATEWAY]: {
        type: "排他网关",
        allowOut: true,
        allowIn: true,
        minOut: 2, // 条件互斥分支，至少 2 条出线
        maxOut: 99,
        minIn: 1,
        maxIn: 99
    },

    [NODE_TYPES.PARALLEL_GATEWAY]: {
        type: "并行网关",
        allowOut: true,
        allowIn: true,
        minOut: 2, // 并行执行，至少 2 条出线
        maxOut: 99,
        minIn: 1,
        maxIn: 99
    },

    [NODE_TYPES.INCLUSIVE_GATEWAY]: {
        type: "包容网关",
        allowOut: true,
        allowIn: true,
        minOut: 2, // 条件可并行分支，至少 2 条出线
        maxOut: 99,
        minIn: 1,
        maxIn: 99
    }
};

/**
 * 根据节点类型获取行为规则
 */
export function getNodeBehavior(type: string): NodeBehavior | undefined {
    return NODE_BEHAVIORS[type];
}

export type { NodeBehavior } from "./types";
export { createConnectRules, createSourceRules, createTargetRules } from "./rules";
