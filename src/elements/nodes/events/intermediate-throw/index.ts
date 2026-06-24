import { LogicFlow } from "@logicflow/core";
import { IntermediateThrowEventModel } from "./model";
import { IntermediateThrowEventView } from "./view";

export function registerIntermediateThrowEvent(lf: LogicFlow) {
    lf.register({
        type: IntermediateThrowEventModel.type,
        model: IntermediateThrowEventModel,
        view: IntermediateThrowEventView
    });
}
