import { GatewayBaseModel } from "../gateway-base-model";
import { NODE_TYPES } from "../../../../core/constants";
import type LogicFlow from "@logicflow/core";

/**
 * 排他网关模型
 */
export class ExclusiveGatewayModel extends GatewayBaseModel {
    static readonly type = NODE_TYPES.EXCLUSIVE_GATEWAY;

    override initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);
    }
}
