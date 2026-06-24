import { LogicFlow } from "@logicflow/core";
import { ExpandedSubProcessModel } from "./model";
import { ExpandedSubProcessView } from "./view";

export function registerExpandedSubProcess(lf: LogicFlow) {
    lf.register({
        type: ExpandedSubProcessModel.type,
        model: ExpandedSubProcessModel,
        view: ExpandedSubProcessView
    });
}
