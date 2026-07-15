import LogicFlow from "@logicflow/core";
import { registerSubProcess } from "./sub-process";
import { registerCallActivity } from "./call-activity";

/**
 * 注册所有子流程与调用节点
 */
export function registerSubProcessNodes(lf: LogicFlow) {
    registerSubProcess(lf);
    registerCallActivity(lf);
}
