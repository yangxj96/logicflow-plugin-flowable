import { LogicFlow } from "@logicflow/core";
import { IntermediateCatchEventModel } from "./model";
import { IntermediateCatchEventView } from "./view";

export function registerIntermediateCatchEvent(lf: LogicFlow) {
    lf.register({
        type: IntermediateCatchEventModel.type,
        model: IntermediateCatchEventModel,
        view: IntermediateCatchEventView
    });
}
