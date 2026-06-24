import { GatewayBaseModel } from "../gateway-base-model";
import { NODE_TYPES } from "../../../../core/constants";

/**
 * 并行网关模型
 */
export class ParallelGatewayModel extends GatewayBaseModel {
    static readonly type = NODE_TYPES.PARALLEL_GATEWAY;

    override initNodeData(data: any) {
        super.initNodeData(data);
    }
}
