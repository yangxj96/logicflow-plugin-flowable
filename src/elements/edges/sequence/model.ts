import { PolylineEdgeModel } from "@logicflow/core";
import { NODE_TYPES } from "../../../core/constants";

/**
 * SequenceFlow模型,自定义连线
 */
export class SequenceFlowModel extends PolylineEdgeModel {
    static readonly type = NODE_TYPES.SEQUENCE_FLOW;

    constructor(data: any, graphModel: any) {
        super(data, graphModel);
    }
}
