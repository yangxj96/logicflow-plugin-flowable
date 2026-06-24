import { LogicFlow } from "@logicflow/core";
import { CallActivityModel } from "./model";
import { CallActivityView } from "./view";

export function registerCallActivity(lf: LogicFlow) {
    lf.register({
        type: CallActivityModel.type,
        model: CallActivityModel,
        view: CallActivityView
    });
}
