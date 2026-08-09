import { GatewayBaseModel } from "../gateway-base-model";
import { NODE_TYPES } from "../../../../core/constants";
import type LogicFlow from "@logicflow/core";

/**
 * 包容网关模型
 */
export class InclusiveGatewayModel extends GatewayBaseModel {
    static readonly type = NODE_TYPES.INCLUSIVE_GATEWAY;

    override initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);
    }
}
