import type LogicFlow from "@logicflow/core";
import { getProcessContext } from "../context/process";
import { ProcessSchema } from "../schema/process";
import { getSchemaByType } from "../schema";
import { Property } from "../schema/types";
import { BPMN_ELEMENT_TAGS } from "./types";

/** BPMN 2.0 / Flowable 命名空间 */
const BPMN_NS = "http://www.omg.org/spec/BPMN/20100524/MODEL";
const FLOWABLE_NS = "http://flowable.org/bpmn";
const BPMNDI_NS = "http://www.omg.org/spec/BPMN/20100524/DI";
const DI_NS = "http://www.omg.org/spec/DD/20100524/DI";
const DC_NS = "http://www.omg.org/spec/DD/20100524/DC";
const XSI_NS = "http://www.w3.org/2001/XMLSchema-instance";

/**
 * 构建缩进
 */
function indent(level: number): string {
    return "    ".repeat(Math.max(0, level));
}

/**
 * 将字段名转换为 BPMN XML 属性名
 */
function fieldToAttrName(field: string): string {
    if (field === "document") return "documentation";
    return field;
}

/**
 * 判断字段是否为 flowable 扩展属性
 */
function isFlowableField(field: string): boolean {
    return field.startsWith("flowable:");
}

/**
 * 构建 BPMN 元素的属性字符串（仅 inline 类型）
 */
function buildAttributes(form: Record<string, any>, schemas: Property[]): string {
    const parts: string[] = [];

    // sourceRef / targetRef 由 extraAttrs 单独处理，避免重复
    const EXTRA_ATTR_FIELDS = new Set(["sourceRef", "targetRef"]);

    for (const schema of schemas) {
        if (schema.type !== "inline") continue;
        if (EXTRA_ATTR_FIELDS.has(schema.field)) continue;

        const value = form[schema.field];

        // id / name 始终输出（BPMN 必要属性），其他空值跳过
        const isRequired = schema.field === "id" || schema.field === "name";
        if (!isRequired && (value == null || value === "" || value === false || value === "false")) continue;
        if (isRequired && (value == null || value === "")) continue;

        const attrName = fieldToAttrName(schema.field);

        if (isFlowableField(schema.field)) {
            const bareName = attrName.replace("flowable:", "");
            parts.push(`flowable:${bareName}="${escapeXml(String(value))}"`);
        } else {
            parts.push(`${attrName}="${escapeXml(String(value))}"`);
        }
    }

    return parts.join(" ");
}

/**
 * 构建 children 类型的子元素 XML
 */
function buildChildren(form: Record<string, any>, schemas: Property[], level: number): string {
    const lines: string[] = [];

    // 事件定义字段列表（输出为空元素）
    const EVENT_DEFINITIONS = new Set([
        "timerEventDefinition",
        "messageEventDefinition",
        "signalEventDefinition",
        "errorEventDefinition"
    ]);

    // terminateAll 特殊处理，输出为 terminateEventDefinition
    const TERMINATE_FIELDS = new Set(["terminateAll"]);

    // conditionExpression 需要 xsi:type 属性
    const CONDITION_EXPRESSION_FIELDS = new Set(["conditionExpression"]);

    for (const schema of schemas) {
        if (schema.type !== "children") continue;

        const value = form[schema.field];
        if (value == null || value === "" || value === false) continue;

        // 事件定义：输出为空元素
        if (EVENT_DEFINITIONS.has(schema.field)) {
            lines.push(`${indent(level)}<${schema.field} />`);
            continue;
        }

        // terminateAll：输出为 terminateEventDefinition
        if (TERMINATE_FIELDS.has(schema.field)) {
            lines.push(`${indent(level)}<terminateEventDefinition />`);
            continue;
        }

        // conditionExpression：添加 xsi:type 属性
        if (CONDITION_EXPRESSION_FIELDS.has(schema.field)) {
            if (schema.cdata) {
                lines.push(
                    `${indent(level)}<conditionExpression xsi:type="tFormalExpression"><![CDATA[${value}]]></conditionExpression>`
                );
            } else {
                lines.push(
                    `${indent(level)}<conditionExpression xsi:type="tFormalExpression">${escapeXml(String(value))}</conditionExpression>`
                );
            }
            continue;
        }

        const tagName = fieldToAttrName(schema.field);

        if (schema.cdata) {
            // CDATA 包裹：内容不转义，直接包裹在 <![CDATA[...]]> 中
            lines.push(`${indent(level)}<${tagName}><![CDATA[${value}]]></${tagName}>`);
        } else {
            lines.push(`${indent(level)}<${tagName}>${escapeXml(String(value))}</${tagName}>`);
        }
    }

    return lines.join("\n");
}

/**
 * 获取 BPMN 元素标签名（去掉 bpmn: 前缀）
 */
function getTagName(type: string): string {
    return BPMN_ELEMENT_TAGS[type] ?? type.replace("bpmn:", "");
}

/**
 * 获取节点/连线的完整 form 数据
 *
 * 策略：先按 schema 构建默认值，再用实际存储的 form 值覆盖。
 * 这样无论 properties.form 是否存在、是否完整，都能导出正确的用户修改值。
 */
function getFormData(data: any, schemas: Property[]): Record<string, any> {
    // 1. 从 schema 构建完整默认值（确保所有属性字段都存在）
    const form: Record<string, any> = {};
    const rawText = typeof data.text === "object" ? (data.text as any)?.value : data.text;

    for (const schema of schemas) {
        if (schema.field === "id") {
            form[schema.field] = data.id ?? schema.default;
        } else if (schema.field === "name") {
            form[schema.field] = rawText ?? schema.default;
        } else {
            form[schema.field] = schema.default;
        }
    }

    // 2. 用实际存储的 form 值覆盖（用户修改过的值优先）
    const storedForm = data.properties?.form as Record<string, any> | undefined;
    if (storedForm) {
        for (const key of Object.keys(storedForm)) {
            if (storedForm[key] != null && storedForm[key] !== "") {
                form[key] = storedForm[key];
            }
        }
    }

    // 3. id / name 最终以 data 为准
    if (data.id) form.id = data.id;
    if (rawText) form.name = rawText;

    return form;
}

/**
 * 从 LogicFlow 实例导出 BPMN 2.0 XML
 */
export function toBpmnXml(lf: LogicFlow): string {
    // 直接从 graphModel 的 model 实例获取最新数据（包含用户通过属性面板修改的 properties.form）
    const graphModel = (lf as any).graphModel;
    const nodes: any[] = [];
    const edges: any[] = [];
    if (graphModel) {
        for (const model of graphModel.nodes ?? []) {
            nodes.push(typeof model.getData === "function" ? model.getData() : model);
        }
        for (const model of graphModel.edges ?? []) {
            edges.push(typeof model.getData === "function" ? model.getData() : model);
        }
    }

    // 获取流程上下文
    const process = getProcessContext(lf);
    const processForm: Record<string, any> = {
        id: process.id,
        name: process.name,
        category: process.category ?? "",
        documentation: process.documentation ?? "",
        isExecutable: String(process.isExecutable ?? true)
    };

    const lines: string[] = [];

    // XML 声明 + definitions 根元素
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push(
        `<definitions` +
            ` xmlns="${BPMN_NS}"` +
            ` xmlns:flowable="${FLOWABLE_NS}"` +
            ` xmlns:bpmndi="${BPMNDI_NS}"` +
            ` xmlns:di="${DI_NS}"` +
            ` xmlns:dc="${DC_NS}"` +
            ` xmlns:xsi="${XSI_NS}"` +
            ` targetNamespace="${escapeXml(process.category || "http://flowable.org/process")}"` +
            `>`
    );

    // process 开始标签（含属性 + 文档子元素）
    const processAttrs = buildAttributes(processForm, ProcessSchema);
    const processAttrStr = processAttrs.includes("isExecutable") ? processAttrs : `${processAttrs} isExecutable="true"`;
    const processDocs = buildChildren(processForm, ProcessSchema, 2);

    lines.push("");
    if (processDocs) {
        lines.push(`${indent(1)}<process ${processAttrStr.trim()}>`);
        lines.push(processDocs);
    } else {
        lines.push(`${indent(1)}<process ${processAttrStr.trim()}>`);
    }

    // 节点
    for (const node of nodes) {
        const tagName = getTagName(node.type);
        if (!tagName || tagName === "sequenceFlow") continue;

        const schemas = (node.properties?.schemas ?? getSchemaByType(node.type)) as Property[];
        const form = getFormData(node, schemas);

        lines.push(buildElement(tagName, form, schemas, 2));
    }

    // 连线
    for (const edge of edges) {
        const tagName = getTagName(edge.type);
        if (!tagName) continue;

        const schemas = (edge.properties?.schemas ?? getSchemaByType(edge.type)) as Property[];
        const form = getFormData(edge, schemas);

        const extraAttrs = [
            `sourceRef="${escapeXml(edge.sourceNodeId)}"`,
            `targetRef="${escapeXml(edge.targetNodeId)}"`
        ].join(" ");

        lines.push(buildElement(tagName, form, schemas, 2, extraAttrs));
    }

    // 关闭 process
    lines.push(`${indent(1)}</process>`);

    // BPMN DI（位置信息）
    lines.push("");
    lines.push(buildBpmnDi(processForm.id, nodes, edges));

    // 关闭 definitions
    lines.push(`</definitions>`);
    lines.push("");

    return lines.join("\n");
}

/**
 * 构建 BPMN DI 段（节点坐标 + 连线路径点）
 */
function buildBpmnDi(processId: string, nodes: any[], edges: any[]): string {
    const lines: string[] = [];
    lines.push(`${indent(1)}<bpmndi:BPMNDiagram>`);
    lines.push(`${indent(2)}<bpmndi:BPMNPlane bpmnElement="${escapeXml(processId)}">`);

    // BPMNShape for each node
    for (const node of nodes) {
        const tagName = getTagName(node.type);
        if (!tagName || tagName === "sequenceFlow") continue;

        const x = Math.round(node.x ?? 0);
        const y = Math.round(node.y ?? 0);
        const w = node.width ?? 120;
        const h = node.height ?? 70;

        lines.push(
            `${indent(3)}<bpmndi:BPMNShape id="shape-${escapeXml(node.id)}" bpmnElement="${escapeXml(node.id)}">`
        );
        lines.push(`${indent(4)}<dc:Bounds x="${x}" y="${y}" width="${w}" height="${h}" />`);
        lines.push(`${indent(3)}</bpmndi:BPMNShape>`);
    }

    // BPMNEdge for each sequence flow
    for (const edge of edges) {
        const tagName = getTagName(edge.type);
        if (!tagName) continue;

        const source = nodes.find((n: any) => n.id === edge.sourceNodeId);
        const target = nodes.find((n: any) => n.id === edge.targetNodeId);

        if (source && target) {
            const sx = Math.round((source.x ?? 0) + (source.width ?? 120) / 2);
            const sy = Math.round((source.y ?? 0) + (source.height ?? 70) / 2);
            const tx = Math.round((target.x ?? 0) + (target.width ?? 120) / 2);
            const ty = Math.round((target.y ?? 0) + (target.height ?? 70) / 2);

            lines.push(
                `${indent(3)}<bpmndi:BPMNEdge id="edge-${escapeXml(edge.id)}" bpmnElement="${escapeXml(edge.id)}">`
            );
            lines.push(`${indent(4)}<di:waypoint x="${sx}" y="${sy}" />`);
            lines.push(`${indent(4)}<di:waypoint x="${tx}" y="${ty}" />`);
            lines.push(`${indent(3)}</bpmndi:BPMNEdge>`);
        }
    }

    lines.push(`${indent(2)}</bpmndi:BPMNPlane>`);
    lines.push(`${indent(1)}</bpmndi:BPMNDiagram>`);

    return lines.join("\n");
}

/**
 * 构建单个 BPMN 元素的 XML
 */
function buildElement(
    tagName: string,
    form: Record<string, any>,
    schemas: Property[],
    level: number,
    extraAttrs?: string
): string {
    const attrs = buildAttributes(form, schemas);
    const children = buildChildren(form, schemas, level + 1);

    const attrStr = [attrs, extraAttrs].filter(Boolean).join(" ");
    const hasChildren = children.length > 0;

    if (hasChildren) {
        return [
            `${indent(level)}<${tagName}${attrStr ? " " + attrStr : ""}>`,
            children,
            `${indent(level)}</${tagName}>`
        ].join("\n");
    }

    return `${indent(level)}<${tagName}${attrStr ? " " + attrStr : ""} />`;
}

/**
 * XML 转义
 */
function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
