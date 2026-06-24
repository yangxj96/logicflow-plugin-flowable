import { Property } from "./types";
import { NODE_TYPES } from "../../core/constants";

// 流程
export { ProcessSchema } from "./process";

// 事件
export { StartEventSchema } from "./nodes/event/start-event";
export { EndEventSchema } from "./nodes/event/end-event";

// 任务
export { UserTaskSchema } from "./nodes/task/user-task";
export { ServiceTaskSchema } from "./nodes/task/service-task";
export { ScriptTaskSchema } from "./nodes/task/script-task";
export { ReceiveTaskSchema } from "./nodes/task/receive-task";

// 网关
export { ExclusiveGatewaySchema } from "./nodes/gateway/exclusive-gateway";
export { ParallelGatewaySchema } from "./nodes/gateway/parallel-gateway";
export { InclusiveGatewaySchema } from "./nodes/gateway/inclusive-gateway";

// 连线
export { SequenceFlowSchema } from "./edges/sequence-flow";

// 静态导入用于注册表
import { StartEventSchema } from "./nodes/event/start-event";
import { EndEventSchema } from "./nodes/event/end-event";
import { UserTaskSchema } from "./nodes/task/user-task";
import { ServiceTaskSchema } from "./nodes/task/service-task";
import { ScriptTaskSchema } from "./nodes/task/script-task";
import { ReceiveTaskSchema } from "./nodes/task/receive-task";
import { ExclusiveGatewaySchema } from "./nodes/gateway/exclusive-gateway";
import { ParallelGatewaySchema } from "./nodes/gateway/parallel-gateway";
import { InclusiveGatewaySchema } from "./nodes/gateway/inclusive-gateway";
import { SequenceFlowSchema } from "./edges/sequence-flow";

/**
 * 节点类型 → Schema 映射表
 */
const schemaRegistry: Record<string, Property[]> = {
    // 事件
    [NODE_TYPES.START_EVENT]: StartEventSchema,
    [NODE_TYPES.END_EVENT]: EndEventSchema,

    // 任务
    [NODE_TYPES.USER_TASK]: UserTaskSchema,
    [NODE_TYPES.SERVICE_TASK]: ServiceTaskSchema,
    [NODE_TYPES.SCRIPT_TASK]: ScriptTaskSchema,
    [NODE_TYPES.RECEIVE_TASK]: ReceiveTaskSchema,

    // 网关
    [NODE_TYPES.EXCLUSIVE_GATEWAY]: ExclusiveGatewaySchema,
    [NODE_TYPES.PARALLEL_GATEWAY]: ParallelGatewaySchema,
    [NODE_TYPES.INCLUSIVE_GATEWAY]: InclusiveGatewaySchema,

    // 连线
    [NODE_TYPES.SEQUENCE_FLOW]: SequenceFlowSchema
};

/**
 * 根据节点类型获取对应的 Schema
 * @param type BPMN 节点类型（如 "bpmn:userTask"）
 * @returns 属性 Schema 数组，未匹配到返回空数组
 */
export function getSchemaByType(type: string): Property[] {
    return schemaRegistry[type] ?? [];
}
