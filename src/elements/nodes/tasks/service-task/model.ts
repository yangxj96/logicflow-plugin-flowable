import LogicFlow from "@logicflow/core";
import { TaskBaseModel } from "../task-base-model";
import { NODE_TYPES } from "../../../../core/constants";

/**
 * 服务任务模型
 */
export class ServiceTaskModel extends TaskBaseModel {
    static readonly type = NODE_TYPES.SERVICE_TASK;

    initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);
    }
}
