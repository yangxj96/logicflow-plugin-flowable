import type LogicFlow from "@logicflow/core";
import { getSchemaByType } from "../schema";
import { Property } from "../schema/types";
import { XML_TAG_TO_TYPE, VALID_FLOW_ELEMENTS, ImportResult } from "./types";
import { getProcessContext } from "../context/process";
import { BpmnIdGenerator } from "../../helper/id-generator";
import { BpmnProperties, FormModel } from "../../core/domain-types";

interface ImportedNode extends Omit<LogicFlow.NodeConfig<BpmnProperties>, "x" | "y"> {
    id: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

interface ImportedEdge extends LogicFlow.EdgeConfig<BpmnProperties> {
    id: string;
    type: string;
}

interface AdjustableEdgeModel {
    id: string;
    startPoint?: BpmnPoint;
    endPoint?: BpmnPoint;
    pointsList?: BpmnPoint[];
    orthogonalizePath?: (points: BpmnPoint[]) => BpmnPoint[];
    getPath?: (points: BpmnPoint[]) => string;
    updateAttributes: (attributes: { pointsList: BpmnPoint[]; points: string }) => void;
}

/** BPMN 命名空间 */
const BPMN_NS = "http://www.omg.org/spec/BPMN/20100524/MODEL";

/**
 * 从 BPMN XML 字符串导入流程图
 */
export function fromBpmnXml(xmlString: string, lf: LogicFlow): ImportResult {
    // 0. 预处理：去除重复属性（修复旧版导出的 bug）
    xmlString = dedupeAttrs(xmlString);

    // 1. 解析 XML
    const parser = new DOMParser();
    let doc: Document;
    try {
        doc = parser.parseFromString(xmlString, "application/xml");
    } catch {
        return { success: false, message: "XML 格式错误，无法解析" };
    }

    // 检查解析错误
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
        return { success: false, message: `XML 解析失败: ${parseError.textContent}` };
    }

    // 2. 验证根元素
    const definitions = doc.documentElement;
    if (!definitions || definitions.localName !== "definitions") {
        return { success: false, message: "不是合法的 BPMN 2.0 文件：缺少 <definitions> 根元素" };
    }

    // 3. 查找 process 元素
    const processEl = findProcessElement(definitions);
    if (!processEl) {
        return { success: false, message: "BPMN 文件中未找到 <process> 元素" };
    }

    // 4. 获取流程属性
    const processId = processEl.getAttribute("id") || BpmnIdGenerator.generate("process");
    const processName = processEl.getAttribute("name") || "导入流程";
    const isExecutable = processEl.getAttribute("isExecutable") !== "false";

    // 更新流程上下文
    const ctx = getProcessContext(lf);
    ctx.id = processId;
    ctx.name = processName;
    ctx.isExecutable = isExecutable;
    // 通知属性面板刷新流程级表单。上下文对象本身不是 Vue 响应式对象，
    // 仅修改字段不会触发已经挂载的属性面板更新。
    lf.emit("process:change", { data: { ...ctx } });

    // 5. 收集所有流程元素
    const nodes: ImportedNode[] = [];
    const edges: ImportedEdge[] = [];
    const usedIds = new Set<string>();

    for (const el of processEl.children) {
        // 使用 localName 去除命名空间前缀（e.g. bpmn:startEvent → startEvent）
        const tagName = el.localName || el.tagName;
        if (!VALID_FLOW_ELEMENTS.has(tagName)) continue;

        if (tagName === "sequenceFlow") {
            const edge = parseSequenceFlow(el, usedIds);
            if (edge) edges.push(edge);
        } else {
            const node = parseFlowNode(el, tagName, usedIds);
            if (node) nodes.push(node);
        }
    }

    if (nodes.length === 0) {
        return { success: false, message: "流程中没有任何节点元素" };
    }

    // 6. 读取 BPMN DI 位置信息，有则使用，无则自动布局
    const diPositions = readBpmnDi(definitions, processId);
    if (diPositions.shapes.size > 0) {
        applyPositions(nodes, diPositions);
    } else {
        autoLayout(nodes);
    }
    applyEdgeWaypoints(edges, diPositions);

    // 7. 渲染到画布
    lf.render({
        nodes: nodes as LogicFlow.NodeConfig[],
        edges
    });
    alignImportedEdgeEndpoints(lf, edges);

    return {
        success: true,
        message: `成功导入流程 "${processName}"，共 ${nodes.length} 个节点、${edges.length} 条连线`,
        processName,
        nodes: nodes as LogicFlow.NodeConfig[],
        edges
    };
}

/**
 * 去除 XML 中重复的属性（保留第一次出现）
 */
function dedupeAttrs(xml: string): string {
    // 匹配 XML 开始标签（含自闭合），对属性去重保留首次出现
    // 匹配: <tagName attrs > 或 <ns:tagName attrs />（不含 </closing>）
    return xml.replace(/<([\w:]+)((?:\s[^/>]*?)?)\s*\/?>/g, (_match, tag, attrsStr) => {
        if (!attrsStr.trim()) return _match; // 无属性，不改

        const seen = new Set<string>();
        const unique: string[] = [];
        const attrRegex = /(\S+?)\s*=\s*("[^"]*"|'[^']*')/g;
        let m: RegExpExecArray | null;
        while ((m = attrRegex.exec(attrsStr)) !== null) {
            const name = m[1];
            if (!seen.has(name)) {
                seen.add(name);
                unique.push(m[0]);
            }
        }
        const suffix = _match.endsWith("/>") ? " />" : ">";
        return `<${tag}${unique.length ? " " + unique.join(" ") : ""}${suffix}`;
    });
}

/**
 * 查找 process 元素（支持带或不带命名空间前缀）
 */
function findProcessElement(definitions: Element): Element | null {
    for (const child of definitions.children) {
        if (child.localName === "process") {
            return child;
        }
    }
    return null;
}

/**
 * 解析单个流程节点
 */
function parseFlowNode(el: Element, tagName: string, usedIds: Set<string>): ImportedNode | null {
    const type = XML_TAG_TO_TYPE[tagName];
    if (!type) return null;

    // 生成或获取 id
    let id = el.getAttribute("id");
    if (!id || usedIds.has(id)) {
        id = BpmnIdGenerator.generate("node");
    }
    usedIds.add(id);

    // 获取 name
    let name = el.getAttribute("name") || "";

    // 构建 form 数据
    const schemas = getSchemaByType(type);
    const form: FormModel = {};

    if (schemas.length > 0) {
        // 先填充默认值
        for (const schema of schemas) {
            form[schema.field] = schema.default;
        }

        // 从 XML 属性覆盖值
        for (const schema of schemas) {
            if (schema.type === "inline") {
                let attrName = schema.field;
                if (attrName === "document") attrName = "documentation";
                if (attrName.startsWith("flowable:")) {
                    // flowable:assignee → 查找 flowable:assignee 属性
                    const attrValue =
                        el.getAttributeNS("http://flowable.org/bpmn", attrName.replace("flowable:", "")) ??
                        el.getAttribute(attrName);
                    if (attrValue != null) form[schema.field] = attrValue;
                } else {
                    const attrValue = el.getAttribute(attrName);
                    if (attrValue != null) form[schema.field] = attrValue;
                }
            } else if (schema.type === "children") {
                // 查找子元素
                let childTag = schema.field;
                if (childTag === "document") childTag = "documentation";
                const child = findChildElement(el, childTag);
                if (child) {
                    form[schema.field] = child.textContent || "";
                }
            }
        }
    }

    // id / name 特殊处理
    form.id = id;
    form.name = name;

    return {
        id,
        type,
        text: name || tagName,
        properties: {
            form,
            schemas
        }
    };
}

/**
 * 查找子元素（支持带或不带命名空间）
 */
function findChildElement(parent: Element, localName: string): Element | null {
    for (const child of parent.children) {
        if (child.localName === localName) {
            return child;
        }
    }
    return null;
}

/**
 * 解析 sequenceFlow
 */
function parseSequenceFlow(el: Element, usedIds: Set<string>): ImportedEdge | null {
    const sourceRef = el.getAttribute("sourceRef");
    const targetRef = el.getAttribute("targetRef");

    if (!sourceRef || !targetRef) return null;

    let id = el.getAttribute("id");
    if (!id || usedIds.has(id)) {
        id = BpmnIdGenerator.generate("edge");
    }
    usedIds.add(id);

    const name = el.getAttribute("name") || "";
    const schemas = getSchemaByType("bpmn:sequenceFlow");
    const form: FormModel = {};
    for (const schema of schemas) {
        form[schema.field] = schema.default;
    }
    form.id = id;
    form.name = name;
    form.sourceRef = sourceRef;
    form.targetRef = targetRef;

    // 读取 conditionExpression
    const condEl = findChildElement(el, "conditionExpression");
    if (condEl) {
        form.conditionExpression = condEl.textContent || "";
    }

    return {
        id,
        type: "bpmn:sequenceFlow",
        sourceNodeId: sourceRef,
        targetNodeId: targetRef,
        text: name,
        properties: {
            form,
            schemas
        }
    };
}

/**
 * 从 BPMN DI 段读取节点位置
 */
type BpmnPoint = { x: number; y: number };

interface BpmnDiPositions {
    shapes: Map<string, { x: number; y: number; width: number; height: number }>;
    edges: Map<string, BpmnPoint[]>;
}

/**
 * 读取 BPMN DI 中的节点位置和连线路径点。
 *
 * BPMNEdge 的 bpmnElement 指向 process 中的 sequenceFlow id，
 * di:waypoint 则描述了编辑器保存的实际折线路径。
 */
function readBpmnDi(definitions: Element, _processId: string): BpmnDiPositions {
    const shapes = new Map<string, { x: number; y: number; width: number; height: number }>();
    const edges = new Map<string, BpmnPoint[]>();

    const diagram = findChildElement(definitions, "BPMNDiagram");
    if (!diagram) return { shapes, edges };

    const plane = findChildElement(diagram, "BPMNPlane");
    if (!plane) return { shapes, edges };

    for (const child of plane.children) {
        if (child.localName === "BPMNShape") {
            const bpmnElement = child.getAttribute("bpmnElement");
            if (!bpmnElement) continue;

            const bounds = findChildElement(child, "Bounds");
            if (!bounds) continue;

            const x = parseFloat(bounds.getAttribute("x") ?? "0");
            const y = parseFloat(bounds.getAttribute("y") ?? "0");
            const width = parseFloat(bounds.getAttribute("width") ?? "0");
            const height = parseFloat(bounds.getAttribute("height") ?? "0");

            if (!isNaN(x) && !isNaN(y) && width > 0 && height > 0) {
                shapes.set(bpmnElement, { x, y, width, height });
            }
            continue;
        }

        if (child.localName !== "BPMNEdge") continue;

        const bpmnElement = child.getAttribute("bpmnElement");
        if (!bpmnElement) continue;

        const waypoints = Array.from(child.children)
            .filter(waypoint => waypoint.localName === "waypoint")
            .map(waypoint => ({
                x: parseFloat(waypoint.getAttribute("x") ?? ""),
                y: parseFloat(waypoint.getAttribute("y") ?? "")
            }))
            .filter(point => !isNaN(point.x) && !isNaN(point.y));

        if (waypoints.length >= 2) {
            edges.set(bpmnElement, waypoints);
        }
    }

    return { shapes, edges };
}

/**
 * 将 DI 位置应用到节点上
 */
function applyPositions(
    nodes: ImportedNode[],
    di: { shapes: Map<string, { x: number; y: number; width: number; height: number }> }
): void {
    for (const node of nodes) {
        const pos = di.shapes.get(node.id);
        if (pos) {
            // BPMN Bounds 使用左上角坐标，LogicFlow 节点使用中心点坐标。
            node.x = pos.x + pos.width / 2;
            node.y = pos.y + pos.height / 2;
        }
    }
    // 没有 DI 位置的节点使用简单偏移
    let offsetY = 100;
    for (const node of nodes) {
        if (node.x == null) {
            node.x = 300;
            node.y = offsetY;
            offsetY += 120;
        }
    }
}

/**
 * 将 BPMN DI 的连线路径恢复到 LogicFlow edge.pointsList。
 */
function applyEdgeWaypoints(edges: ImportedEdge[], di: BpmnDiPositions): void {
    for (const edge of edges) {
        const waypoints = di.edges.get(edge.id);
        if (!waypoints) continue;

        edge.pointsList = waypoints.map(point => ({
            x: point.x,
            y: point.y
        }));
    }
}

/**
 * 将已恢复路径的首尾点对齐到 LogicFlow 实际计算出的节点锚点。
 *
 * BPMN DI 的 waypoint 通常基于 BPMN 元素尺寸，而插件节点可能使用不同的
 * 图形尺寸。若直接使用原始首尾点，边虽然已经绘制出来，但箭头可能落在
 * 节点图形内部，直到移动节点触发 LogicFlow 重算后才显示。
 */
function alignImportedEdgeEndpoints(lf: LogicFlow, importedEdges: ImportedEdge[]): void {
    const graphModel = lf.graphModel;

    const importedEdgeIds = new Set(
        importedEdges.filter(edge => Array.isArray(edge.pointsList) && edge.pointsList.length >= 2).map(edge => edge.id)
    );

    for (const rawEdgeModel of graphModel.edges) {
        const edgeModel = rawEdgeModel as unknown as AdjustableEdgeModel;
        if (!importedEdgeIds.has(edgeModel.id)) continue;
        if (
            !edgeModel.startPoint ||
            !edgeModel.endPoint ||
            !Array.isArray(edgeModel.pointsList) ||
            edgeModel.pointsList.length < 2
        )
            continue;

        const points = edgeModel.pointsList.map((point: BpmnPoint) => ({
            x: point.x,
            y: point.y
        }));
        points[0] = { x: edgeModel.startPoint.x, y: edgeModel.startPoint.y };
        points[points.length - 1] = { x: edgeModel.endPoint.x, y: edgeModel.endPoint.y };

        const normalizedPoints =
            typeof edgeModel.orthogonalizePath === "function" ? edgeModel.orthogonalizePath(points) : points;
        const path =
            typeof edgeModel.getPath === "function"
                ? edgeModel.getPath(normalizedPoints)
                : normalizedPoints.map((point: BpmnPoint) => `${point.x},${point.y}`).join(" ");

        edgeModel.updateAttributes({
            pointsList: normalizedPoints,
            points: path
        });
    }
}

/**
 * 自动布局：简单网格排列
 */
function autoLayout(nodes: ImportedNode[]): void {
    const COLUMNS = 4;
    const COL_SPACING = 200;
    const ROW_SPACING = 120;
    const START_Y = 100;

    // 开始事件放最上面
    const startNodes = nodes.filter(n => n.type === "bpmn:startEvent");
    const endNodes = nodes.filter(n => n.type === "bpmn:endEvent");
    const otherNodes = nodes.filter(n => n.type !== "bpmn:startEvent" && n.type !== "bpmn:endEvent");

    let currentY = START_Y;

    // 开始事件单独一行，居中
    if (startNodes.length > 0) {
        const totalWidth = (startNodes.length - 1) * COL_SPACING;
        const startX = 400 - totalWidth / 2;
        startNodes.forEach((node, i) => {
            node.x = startX + i * COL_SPACING;
            node.y = currentY;
        });
        currentY += ROW_SPACING;
    }

    // 其他节点网格排列
    otherNodes.forEach((node, i) => {
        const col = i % COLUMNS;
        const row = Math.floor(i / COLUMNS);
        node.x = 200 + col * COL_SPACING;
        node.y = currentY + row * ROW_SPACING;
    });

    if (otherNodes.length > 0) {
        currentY += Math.ceil(otherNodes.length / COLUMNS) * ROW_SPACING;
    }

    // 结束事件单独一行，居中
    if (endNodes.length > 0) {
        const totalWidth = (endNodes.length - 1) * COL_SPACING;
        const startX = 400 - totalWidth / 2;
        endNodes.forEach((node, i) => {
            node.x = startX + i * COL_SPACING;
            node.y = currentY;
        });
    }
}
