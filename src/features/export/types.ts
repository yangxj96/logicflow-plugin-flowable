/**
 * BPMN XML 导出相关类型
 */

/**
 * BPMN 元素标签名映射
 * NODE_TYPES 中的 bpmn:xxx → BPMN XML 元素名（去掉 bpmn: 前缀）
 */
export const BPMN_ELEMENT_TAGS: Record<string, string> = {
    "bpmn:startEvent": "startEvent",
    "bpmn:endEvent": "endEvent",
    "bpmn:intermediateCatchEvent": "intermediateCatchEvent",
    "bpmn:intermediateThrowEvent": "intermediateThrowEvent",
    "bpmn:boundaryEvent": "boundaryEvent",
    "bpmn:subProcess": "subProcess",
    "bpmn:expandedSubProcess": "expandedSubProcess",
    "bpmn:callActivity": "callActivity",
    "bpmn:userTask": "userTask",
    "bpmn:serviceTask": "serviceTask",
    "bpmn:scriptTask": "scriptTask",
    "bpmn:receiveTask": "receiveTask",
    "bpmn:exclusiveGateway": "exclusiveGateway",
    "bpmn:parallelGateway": "parallelGateway",
    "bpmn:inclusiveGateway": "inclusiveGateway",
    "bpmn:sequenceFlow": "sequenceFlow"
};
