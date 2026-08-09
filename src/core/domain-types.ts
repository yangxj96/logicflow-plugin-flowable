import type LogicFlow from "@logicflow/core";
import type { Property } from "../features/schema/types";

export type FormModel = Record<string, unknown>;

export interface BpmnProperties extends LogicFlow.PropertiesType {
    form?: FormModel;
    schemas?: Property[];
    rules?: Record<string, unknown>;
    name?: string;
}

export type BpmnNodeConfig = LogicFlow.NodeConfig<BpmnProperties>;
export type BpmnEdgeConfig = LogicFlow.EdgeConfig<BpmnProperties>;

export interface FlowElementData {
    id: string;
    type: string;
    text?: LogicFlow.TextConfig | string;
    properties?: BpmnProperties;
}

export function getTextValue(text: LogicFlow.TextConfig | string | undefined): unknown {
    return typeof text === "object" && text !== null ? text.value : text;
}

export function getDisplayName(properties: LogicFlow.PropertiesType, fallback: unknown): string {
    const bpmnProperties = properties as BpmnProperties;
    return String(bpmnProperties.form?.name ?? bpmnProperties.name ?? fallback ?? "");
}
