import type LogicFlow from "@logicflow/core";
import { BpmnIdGenerator } from "../../helper/id-generator";
import { ProcessModel } from "./types";

const processContexts = new WeakMap<LogicFlow, ProcessModel>();

/**
 * 初始化流程上下文
 * @param lf {@link LogicFlow} 实例对象
 */
export function initProcessContext(lf: LogicFlow) {
    if (processContexts.has(lf)) return;
    processContexts.set(lf, {
        // BPMN 的 id 必须符合 XML NCName，不能以数字开头。
        id: BpmnIdGenerator.generate("process"),
        name: "新建流程",
        isExecutable: true
    });
}

/**
 * 获取流程上下文
 * @param lf {@link LogicFlow} 实例对象
 */
export function getProcessContext(lf: LogicFlow): ProcessModel {
    const ctx = processContexts.get(lf);
    if (!ctx) {
        throw new Error("[flowable] process context not initialized");
    }
    return ctx;
}
