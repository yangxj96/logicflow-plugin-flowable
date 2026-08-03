import type LogicFlow from "@logicflow/core";
import { BpmnIdGenerator } from "../../helper/id-generator";
import { ProcessModel } from "./types";

export const PROCESS_CONTEXT = Symbol("logicflow-plugin-flowable:process");

/**
 * 初始化流程上下文
 * @param lf {@link LogicFlow} 实例对象
 */
export function initProcessContext(lf: LogicFlow) {
    if ((lf as any)[PROCESS_CONTEXT]) return;
    (lf as any)[PROCESS_CONTEXT] = {
        // BPMN 的 id 必须符合 XML NCName，不能以数字开头。
        id: BpmnIdGenerator.generate("process"),
        name: "新建流程",
        isExecutable: true
    } as ProcessModel;
}

/**
 * 获取流程上下文
 * @param lf {@link LogicFlow} 实例对象
 */
export function getProcessContext(lf: LogicFlow): ProcessModel {
    const ctx = (lf as any)[PROCESS_CONTEXT] as ProcessModel;
    if (!ctx) {
        throw new Error("[flowable] process context not initialized");
    }
    return ctx;
}
