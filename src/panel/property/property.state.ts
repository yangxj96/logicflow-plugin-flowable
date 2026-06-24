import LogicFlow from "@logicflow/core";
import { computed, ref } from "vue";
import { getProcessContext } from "../../features/context/process";
import { ProcessModel } from "../../features/context/types";
import { PropertyPanelState } from "./types";
import type { FormInstance } from "element-plus";

/**
 * 初始化state
 * @param lf LogicFlow实例
 */
export function usePropertyPanel(lf: LogicFlow): PropertyPanelState {
    // 模式
    const mode = ref<"node" | "edge" | "process">("process");
    // 流程
    const process = ref<ProcessModel>(getProcessContext(lf));
    // 表单信息
    const formRef = ref<FormInstance>();
    // 当前节点
    const currentNode = ref<LogicFlow.NodeData | undefined>(undefined);
    // 当前线
    const currentEdge = ref<LogicFlow.EdgeData | undefined>(undefined);

    /**
     * 表单 key，用于在切换选中元素时强制重建表单
     */
    const formKey = computed(() => {
        if (mode.value === "process") return "form-process";
        if (mode.value === "node" && currentNode.value) {
            return `form-node-${currentNode.value.id}`;
        }
        if (mode.value === "edge" && currentEdge.value) {
            return `form-edge-${currentEdge.value.id}`;
        }
        return "form-empty";
    });

    return {
        lf,
        mode,
        process,
        formRef,
        currentNode,
        currentEdge,
        formKey
    };
}
