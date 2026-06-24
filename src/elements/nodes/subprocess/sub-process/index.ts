import { LogicFlow } from "@logicflow/core";
import { SubProcessModel } from "./model";
import { SubProcessView } from "./view";

export function registerSubProcess(lf: LogicFlow) {
    lf.register({
        type: SubProcessModel.type,
        model: SubProcessModel,
        view: SubProcessView
    });
}
