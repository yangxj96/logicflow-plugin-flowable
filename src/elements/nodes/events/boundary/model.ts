import LogicFlow, { CircleNodeModel, GraphModel } from "@logicflow/core";
import { NODE_TYPES } from "../../../../core/constants";
import { BpmnProperties } from "../../../../core/domain-types";
import { createConnectRules, getNodeBehavior } from "../../../../features/behaviors";

/**
 * 边界事件节点模型
 *
 * BPMN 规则：依附于活动，只能连出
 */
export class BoundaryEventModel extends CircleNodeModel {
    static readonly type = NODE_TYPES.BOUNDARY_EVENT;

    constructor(data: LogicFlow.NodeConfig, graphModel: GraphModel) {
        super(data, graphModel);
        this.r = 22;
        this.resizable = false;

        // 边界事件：只出不进
        this.isAllowIncoming = false;
        this.isAllowOutgoing = true;

        this.applyConnectRules();
    }

    initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);

        if ((data.properties as BpmnProperties | undefined)?.form) return;
    }

    private applyConnectRules(): void {
        const behavior = getNodeBehavior(this.type);
        if (!behavior) return;
        const { sourceRules, targetRules } = createConnectRules(behavior);
        this.sourceRules = sourceRules;
        this.targetRules = targetRules;
    }
}
