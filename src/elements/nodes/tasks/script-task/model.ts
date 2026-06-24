import LogicFlow from "@logicflow/core";
import { TaskBaseModel } from "../task-base-model";
import { NODE_TYPES } from "../../../../core/constants";

/**
 * 脚本任务模型
 */
export class ScriptTaskModel extends TaskBaseModel {
    static readonly type = NODE_TYPES.SCRIPT_TASK;

    initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);
    }
}
