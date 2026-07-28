import { computed, h, VNode } from "vue";
import {
    ElButton,
    ElCard,
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElSelect,
    ElOption,
    ElSwitch,
    ElTag
} from "element-plus";
import { NODE_TYPE_NAMES } from "../../core/constants";
import { getSchemaByType } from "../../features/schema";
import { ProcessSchema } from "../../features/schema";
import { PickerRequestPayload, Property, PropertyComponent } from "../../features/schema/types";
import { PropertyPanelState } from "./types";

/**
 * 创建属性面板渲染上下文（在 setup 中调用，创建 computed 等响应式对象）
 */
/**
 * 防抖持久化 form 到模型
 */
function createFormSync(state: PropertyPanelState) {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return function syncForm(model: Record<string, any>) {
        if (state.mode.value === "process") return;
        const targetId = state.mode.value === "node" ? state.currentNode.value?.id : state.currentEdge.value?.id;
        if (!targetId) return;

        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            try {
                state.lf.setProperties(targetId, {
                    form: { ...model },
                    name: model.name
                });
            } catch {
                // 忽略
            }
        }, 200);
    };
}

export function usePropertyRender(state: PropertyPanelState) {
    const syncForm = createFormSync(state);
    // 面板标题
    const title = computed(() => {
        const { mode, currentNode, currentEdge } = state;

        if (mode.value === "process") {
            return "流程属性";
        }
        if (mode.value === "node") {
            const type = currentNode.value?.type;
            return (type && NODE_TYPE_NAMES[type]) || "节点属性";
        }
        if (mode.value === "edge") {
            const type = currentEdge.value?.type;
            return (type && NODE_TYPE_NAMES[type]) || "线属性";
        }
        return "";
    });

    // 当前生效的 schema 列表
    const currentSchemas = computed<Property[]>(() => {
        if (state.mode.value === "process") {
            return ProcessSchema;
        }
        if (state.mode.value === "node" && state.currentNode.value) {
            return state.currentNode.value.properties?.schemas ?? getSchemaByType(state.currentNode.value.type);
        }
        if (state.mode.value === "edge" && state.currentEdge.value) {
            return state.currentEdge.value.properties?.schemas ?? getSchemaByType(state.currentEdge.value.type);
        }
        return [];
    });

    // 当前表单数据对象
    const currentModel = computed<Record<string, any>>(() => {
        if (state.mode.value === "process") {
            return state.process.value as unknown as Record<string, any>;
        }
        if (state.mode.value === "node" && state.currentNode.value) {
            return state.currentNode.value.properties?.form ?? {};
        }
        if (state.mode.value === "edge" && state.currentEdge.value) {
            return state.currentEdge.value.properties?.form ?? {};
        }
        return {};
    });

    /**
     * 渲染函数
     */
    function render() {
        return h(
            ElCard,
            {
                class: "lf-property-card",
                shadow: "never",
                style: { width: "100%", height: "100%", border: "none" }
            },
            {
                header: () => h("span", { style: { fontWeight: 600 } }, title.value),
                default: () =>
                    h(
                        ElForm,
                        {
                            key: state.formKey.value,
                            ref: state.formRef,
                            model: currentModel.value,
                            labelPosition: "top",
                            size: "small"
                        },
                        () =>
                            currentSchemas.value.map(schema =>
                                renderFormItem(schema, currentModel.value, state, syncForm)
                            )
                    )
            }
        );
    }

    return { render };
}

/**
 * 根据 schema 渲染单个表单项
 */
function renderFormItem(
    schema: Property,
    model: Record<string, any>,
    state: PropertyPanelState,
    syncForm: (m: Record<string, any>) => void
): VNode {
    const field = schema.field;

    return h(
        ElFormItem,
        {
            key: field,
            label: schema.label,
            prop: field,
            rules: schema.rules
                ? [
                      {
                          required: schema.rules.required,
                          message: schema.rules.message ?? `${schema.label}不能为空`,
                          trigger: ["blur", "change"]
                      }
                  ]
                : undefined
        },
        () => renderControl(schema, model, state, syncForm)
    );
}

/**
 * 根据 schema.component 渲染对应的表单控件
 */
function renderControl(
    schema: Property,
    model: Record<string, any>,
    state: PropertyPanelState,
    syncForm: (m: Record<string, any>) => void
): VNode {
    const field = schema.field;
    const component = schema.component as PropertyComponent;

    /**
     * 表单值更新回调 — 更新内存 form、同步节点文本、防抖持久化到模型
     */
    function onUpdate(val: any) {
        model[field] = val;

        // name 字段：立即更新节点显示文本（所有节点类型通用）
        if (field === "name" && state.mode.value !== "process") {
            const targetId = state.mode.value === "node" ? state.currentNode.value?.id : state.currentEdge.value?.id;
            if (targetId) {
                try {
                    state.lf.updateText(targetId, val ?? "");
                } catch {
                    // 忽略
                }
            }
        }

        syncForm(model);
    }

    switch (component) {
        case "textarea":
            return h(ElInput, {
                modelValue: model[field],
                type: "textarea",
                rows: 3,
                placeholder: `请输入${schema.label}`,
                "onUpdate:modelValue": onUpdate
            });

        case "number":
            return h(ElInputNumber, {
                modelValue: model[field] != null ? Number(model[field]) : undefined,
                placeholder: `请输入${schema.label}`,
                controlsPosition: "right",
                style: { width: "100%" },
                "onUpdate:modelValue": onUpdate
            });

        case "boolean":
            return h(ElSwitch, {
                modelValue: toBoolean(model[field]),
                "onUpdate:modelValue": (val: string | number | boolean) => {
                    model[field] = String(val);
                }
            });

        case "select":
            return h(
                ElSelect,
                {
                    modelValue: model[field],
                    placeholder: `请选择${schema.label}`,
                    style: { width: "100%" },
                    "onUpdate:modelValue": onUpdate
                },
                () =>
                    (schema.options ?? []).map(opt =>
                        h(ElOption, { key: opt.value, label: opt.label, value: opt.value })
                    )
            );

        case "expression":
            return h(ElInput, {
                modelValue: model[field],
                placeholder: `请输入${schema.label}（支持表达式）`,
                "onUpdate:modelValue": onUpdate
            });

        case "picker": {
            const enabled = schema.pickerType && state.pickers.includes(schema.pickerType);

            if (!enabled) {
                return h(ElInput, {
                    modelValue: model[field],
                    placeholder: `请输入${schema.label}`,
                    clearable: true,
                    "onUpdate:modelValue": onUpdate
                });
            }

            const labelField = `${field}Label`;

            function onPick() {
                const payload: PickerRequestPayload = {
                    pickerType: schema.pickerType!,
                    field,
                    currentValue: model[field] ?? "",
                    multiple: schema.pickerMultiple ?? false,
                    nodeId: state.currentNode.value?.id,
                    nodeType: state.currentNode.value?.type,
                    resolve: (value: string, label?: string) => {
                        model[labelField] = label ?? value;
                        onUpdate(value);
                    }
                };
                state.lf.emit("property:picker", payload);
            }

            const vals = String(model[field] ?? "")
                .split(",")
                .filter(Boolean);
            const labs = String(model[labelField] ?? "")
                .split(",")
                .filter(Boolean);

            function removeAt(index: number) {
                const v = [...vals];
                const l = [...labs];
                v.splice(index, 1);
                l.splice(index, 1);
                model[field] = v.join(",");
                model[labelField] = l.join(",");
                syncForm(model);
            }

            const display = h(
                "div",
                { class: "lf-picker-display", onClick: onPick },
                vals.length > 0
                    ? vals.map((v, i) =>
                          h(
                              ElTag,
                              {
                                  key: `${v}-${i}`,
                                  size: "small",
                                  closable: true,
                                  onClose: (e: MouseEvent) => {
                                      e.stopPropagation();
                                      removeAt(i);
                                  }
                              },
                              () => labs[i] || v
                          )
                      )
                    : [h("span", { class: "lf-picker-placeholder" }, `请选择${schema.label}`)]
            );

            return h("div", { style: { display: "flex", gap: "8px", width: "100%", alignItems: "flex-start" } }, [
                display,
                h(ElButton, { type: "primary", onClick: onPick }, () => "选择")
            ]);
        }

        case "string":
        default:
            return h(ElInput, {
                modelValue: model[field],
                placeholder: `请输入${schema.label}`,
                clearable: true,
                "onUpdate:modelValue": onUpdate
            });
    }
}

/**
 * 将值转为布尔
 */
function toBoolean(val: any): boolean {
    if (typeof val === "boolean") return val;
    if (val === "true" || val === "1") return true;
    return false;
}
