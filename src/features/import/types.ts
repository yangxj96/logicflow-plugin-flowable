/**
 * BPMN XML 标签名 → LogicFlow 节点类型（反向映射）
 */
export const XML_TAG_TO_TYPE: Record<string, string> = {
    startEvent: "bpmn:startEvent",
    endEvent: "bpmn:endEvent",
    userTask: "bpmn:userTask",
    serviceTask: "bpmn:serviceTask",
    scriptTask: "bpmn:scriptTask",
    receiveTask: "bpmn:receiveTask",
    manualTask: "bpmn:userTask",
    businessRuleTask: "bpmn:serviceTask",
    exclusiveGateway: "bpmn:exclusiveGateway",
    parallelGateway: "bpmn:parallelGateway",
    inclusiveGateway: "bpmn:inclusiveGateway",
    sequenceFlow: "bpmn:sequenceFlow"
};

/** 合法的 BPMN 流程元素标签名集合 */
export const VALID_FLOW_ELEMENTS = new Set(Object.keys(XML_TAG_TO_TYPE));

/** 导入结果 */
export interface ImportResult {
    success: boolean;
    message: string;
    processName?: string;
    nodes?: any[];
    edges?: any[];
}
