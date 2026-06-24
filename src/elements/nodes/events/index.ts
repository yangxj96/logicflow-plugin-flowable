import LogicFlow from "@logicflow/core";
import { registerStartEvent } from "./start";
import { registerEndEvent } from "./end";
import { registerIntermediateCatchEvent } from "./intermediate-catch";
import { registerIntermediateThrowEvent } from "./intermediate-throw";
import { registerBoundaryEvent } from "./boundary";

/**
 * 注册所有节点对象
 *
 * @param lf {@link LogicFlow} 实例对象
 */
export function registerEventNodes(lf: LogicFlow) {
    registerStartEvent(lf);
    registerEndEvent(lf);
    registerIntermediateCatchEvent(lf);
    registerIntermediateThrowEvent(lf);
    registerBoundaryEvent(lf);
}
