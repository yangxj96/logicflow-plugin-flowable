import LogicFlow from "@logicflow/core";
import { TaskBaseModel } from "../task-base-model";
import { NODE_TYPES } from "../../../../core/constants";

/**
 * 用户任务模型
 */
export class UserTaskModel extends TaskBaseModel {
    static readonly type = NODE_TYPES.USER_TASK;

    initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);
    }
}
