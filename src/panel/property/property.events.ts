import { type PropertyEventOptions } from "./types";
import { getSchemaByType } from "../../features/schema";
import { type Property } from "../../features/schema/types";
import { getProcessContext } from "../../features/context/process";
import { type BpmnProperties, type FlowElementData, type FormModel, getTextValue } from "../../core/domain-types";
import type LogicFlow from "@logicflow/core";

/**
 * 注册属性面板相关事件
 */
export function registerPropertyEvents(options: PropertyEventOptions): () => void {
    const { lf, app, state } = options;

    // ===== 节点点击 =====
    const handleNodeClick = ({ data }: { data: LogicFlow.NodeData }) => {
        state.pickerGuard.invalidateAll();
        run(() => {
            state.mode.value = "node";
            state.currentNode.value = data;
            state.currentEdge.value = undefined;
            ensureAndSyncForm(lf, data);
        });
    };

    // ===== 边点击 =====
    const handleEdgeClick = ({ data }: { data: LogicFlow.EdgeData }) => {
        state.pickerGuard.invalidateAll();
        run(() => {
            state.mode.value = "edge";
            state.currentNode.value = undefined;
            state.currentEdge.value = data;
            ensureAndSyncForm(lf, data);
        });
    };

    // ===== 画布点击 =====
    const handleBlankClick = () => {
        state.pickerGuard.invalidateAll();
        run(() => {
            state.mode.value = "process";
            state.currentNode.value = undefined;
            state.currentEdge.value = undefined;
        });
    };

    // 流程 XML 导入后刷新流程属性面板。
    // 导入逻辑更新的是 LogicFlow 上的原始上下文对象，不能依赖 Vue 自动追踪该变更。
    const handleProcessChange = () => {
        run(() => {
            state.process.value = { ...getProcessContext(lf) };
        });
    };

    // ===== 新增节点（DND / add）=====
    const handleNodeAdd = ({ data }: { data: LogicFlow.NodeData }) => {
        lf.selectElementById(data.id);

        state.pickerGuard.invalidateAll();
        run(() => {
            state.mode.value = "node";
            state.currentNode.value = data;
            state.currentEdge.value = undefined;
            ensureAndSyncForm(lf, data);
        });
    };

    // ===== 新增边 =====
    const handleEdgeAdd = ({ data }: { data: LogicFlow.EdgeData }) => {
        lf.selectElementById(data.id);

        state.pickerGuard.invalidateAll();
        run(() => {
            state.mode.value = "edge";
            state.currentNode.value = undefined;
            state.currentEdge.value = data;
            ensureAndSyncForm(lf, data);
        });
    };

    // ===== 删除时重置 =====
    const handleDelete = ({ data }: { data: FlowElementData }) => {
        state.pickerGuard.invalidateAll();
        run(() => {
            if (state.currentNode.value?.id === data.id) {
                reset();
            }
            if (state.currentEdge.value?.id === data.id) {
                reset();
            }
        });
    };

    function reset() {
        state.mode.value = "process";
        state.currentNode.value = undefined;
        state.currentEdge.value = undefined;
    }

    function run(fn: () => void) {
        if (app?.runWithContext) {
            app.runWithContext(fn);
        } else {
            fn();
        }
    }

    lf.on("node:click", handleNodeClick);
    lf.on("edge:click", handleEdgeClick);
    lf.on("blank:click", handleBlankClick);
    lf.on("process:change", handleProcessChange);
    lf.on("node:add", handleNodeAdd);
    lf.on("node:dnd-add", handleNodeAdd);
    lf.on("edge:add", handleEdgeAdd);
    lf.on("node:delete", handleDelete);
    lf.on("edge:delete", handleDelete);

    return () => {
        state.pickerGuard.invalidateAll();
        lf.off("node:click", handleNodeClick);
        lf.off("edge:click", handleEdgeClick);
        lf.off("blank:click", handleBlankClick);
        lf.off("process:change", handleProcessChange);
        lf.off("node:add", handleNodeAdd);
        lf.off("node:dnd-add", handleNodeAdd);
        lf.off("edge:add", handleEdgeAdd);
        lf.off("node:delete", handleDelete);
        lf.off("edge:delete", handleDelete);
    };
}

/**
 * 确保节点/边的 properties.form 存在并同步
 *
 * model.getData() 返回的 properties 可能是浅拷贝——直接修改不会持久化到 model。
 * 因此通过 lf.setProperties() 将 form 写入模型，保证后续点击/导出都能读到。
 */
function ensureAndSyncForm(lf: LogicFlow, data: FlowElementData) {
    if (!data || !data.type || !data.id) return;

    const schemas = getSchemaByType(data.type);
    if (!schemas || schemas.length === 0) return;

    // 确保 properties 存在
    data.properties ??= {};
    const properties = data.properties as BpmnProperties;

    let form = properties.form;

    if (!form) {
        // 首次初始化：从 schema 构建默认值
        form = buildFormDefaults(schemas, data);
    } else {
        // 已存在：确保所有 schema 字段都在 form 中（补全新增字段）
        for (const schema of schemas) {
            if (!(schema.field in form)) {
                if (schema.field === "id") {
                    form[schema.field] = data.id ?? schema.default;
                } else if (schema.field === "name") {
                    form[schema.field] = getTextValue(data.text) ?? schema.default;
                } else {
                    form[schema.field] = schema.default;
                }
            }
        }
    }

    // 持久化到模型（解决 getData() 浅拷贝导致的数据丢失）
    try {
        lf.setProperties(data.id, { form, schemas });
    } catch {
        // 忽略
    }

    // 挂载到当前事件 data 上供属性面板渲染
    properties.form = form;
    properties.schemas = schemas;
}

/**
 * 根据 schema 和当前数据构建 form 默认值
 */
function buildFormDefaults(schemas: Property[], data: FlowElementData): FormModel {
    const form: FormModel = {};
    for (const schema of schemas) {
        if (schema.field === "id" && data.id) {
            form[schema.field] = data.id;
        } else if (schema.field === "name" && data.text) {
            form[schema.field] = getTextValue(data.text);
        } else {
            form[schema.field] = schema.default;
        }
    }
    return form;
}
