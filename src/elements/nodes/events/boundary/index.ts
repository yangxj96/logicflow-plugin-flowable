import { LogicFlow } from "@logicflow/core";
import { BoundaryEventModel } from "./model";
import { BoundaryEventView } from "./view";

export function registerBoundaryEvent(lf: LogicFlow) {
    lf.register({
        type: BoundaryEventModel.type,
        model: BoundaryEventModel,
        view: BoundaryEventView
    });
}
