import { PropertyEventOptions } from "./types";
import { getSchemaByType } from "../../features/schema";
import { Property } from "../../features/schema/types";

/**
 * 注册属性面板相关事件
 */
export function registerPropertyEvents(options: PropertyEventOptions) {
    const { lf, app, state } = options;

    // ===== 节点点击 =====
    lf.on("node:click", ({ data }) => {
        run(() => {
            state.mode.value = "node";
            state.currentNode.value = data;
            state.currentEdge.value = undefined;
            ensureAndSyncForm(lf, data, "node");
        });
    });

    // ===== 边点击 =====
    lf.on("edge:click", ({ data }) => {
        run(() => {
            state.mode.value = "edge";
            state.currentNode.value = undefined;
            state.currentEdge.value = data;
            ensureAndSyncForm(lf, data, "edge");
        });
    });

    // ===== 画布点击 =====
    lf.on("blank:click", () => {
        run(() => {
            state.mode.value = "process";
            state.currentNode.value = undefined;
            state.currentEdge.value = undefined;
        });
    });

    // ===== 新增节点（DND / add）=====
    const handleNodeAdd = ({ data }: any) => {
        lf.selectElementById(data.id);

        run(() => {
            state.mode.value = "node";
            state.currentNode.value = data;
            state.currentEdge.value = undefined;
            ensureAndSyncForm(lf, data, "node");
        });
    };

    lf.on("node:add", handleNodeAdd);
    lf.on("node:dnd-add", handleNodeAdd);

    // ===== 新增边 =====
    lf.on("edge:add", ({ data }) => {
        lf.selectElementById(data.id);

        run(() => {
            state.mode.value = "edge";
            state.currentNode.value = undefined;
            state.currentEdge.value = data;
            ensureAndSyncForm(lf, data, "edge");
        });
    });

    // ===== 删除时重置 =====
    lf.on("node:delete", resetIfMatch);
    lf.on("edge:delete", resetIfMatch);

    function resetIfMatch({ data }: any) {
        run(() => {
            if (state.currentNode.value?.id === data.id) {
                reset();
            }
            if (state.currentEdge.value?.id === data.id) {
                reset();
            }
        });
    }

    function reset() {
        state.mode.value = "process";
        state.currentNode.value = undefined;
        state.currentEdge.value = undefined;
    }

    function run(fn: () => void) {
        app?.runWithContext ? app.runWithContext(fn) : fn();
    }
}

/**
 * 确保节点/边的 properties.form 存在并同步
 *
 * model.getData() 返回的 properties 可能是浅拷贝——直接修改不会持久化到 model。
 * 因此通过 lf.setProperties() 将 form 写入模型，保证后续点击/导出都能读到。
 */
function ensureAndSyncForm(lf: any, data: any, _kind: "node" | "edge") {
    if (!data || !data.type || !data.id) return;

    const schemas = getSchemaByType(data.type);
    if (!schemas || schemas.length === 0) return;

    // 确保 properties 存在
    if (!data.properties) {
        data.properties = {};
    }

    let form = data.properties.form as Record<string, any> | undefined;

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
                    form[schema.field] =
                        typeof data.text === "object" ? (data.text as any).value : (data.text ?? schema.default);
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
    data.properties.form = form;
    data.properties.schemas = schemas;
}

/**
 * 根据 schema 和当前数据构建 form 默认值
 */
function buildFormDefaults(schemas: Property[], data: any): Record<string, any> {
    const form: Record<string, any> = {};
    for (const schema of schemas) {
        if (schema.field === "id" && data.id) {
            form[schema.field] = data.id;
        } else if (schema.field === "name" && data.text) {
            form[schema.field] = typeof data.text === "object" ? (data.text as any).value : data.text;
        } else {
            form[schema.field] = schema.default;
        }
    }
    return form;
}
