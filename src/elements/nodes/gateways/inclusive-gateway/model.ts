import { GatewayBaseModel } from "../gateway-base-model";
import { NODE_TYPES } from "../../../../core/constants";

/**
 * 包容网关模型
 */
export class InclusiveGatewayModel extends GatewayBaseModel {
    static readonly type = NODE_TYPES.INCLUSIVE_GATEWAY;

    override initNodeData(data: any) {
        super.initNodeData(data);
    }
}
