import LogicFlow from "@logicflow/core";
import { TaskBaseModel } from "../task-base-model";
import { NODE_TYPES } from "../../../../core/constants";

/**
 * 接收任务模型
 */
export class ReceiveTaskModel extends TaskBaseModel {
    static readonly type = NODE_TYPES.RECEIVE_TASK;

    initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);
    }
}
