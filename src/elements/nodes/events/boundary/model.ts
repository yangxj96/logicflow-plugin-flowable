import LogicFlow, { CircleNodeModel } from "@logicflow/core";
import { NODE_TYPES } from "../../../../core/constants";
import { createConnectRules, getNodeBehavior } from "../../../../features/behaviors";

/**
 * 边界事件节点模型
 *
 * BPMN 规则：依附于活动，只能连出
 */
export class BoundaryEventModel extends CircleNodeModel {
    static readonly type = NODE_TYPES.BOUNDARY_EVENT;

    constructor(data: any, graphModel: any) {
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

        if ((data.properties as any)?.form) return;
    }

    private applyConnectRules(): void {
        const behavior = getNodeBehavior(this.type);
        if (!behavior) return;
        const { sourceRules, targetRules } = createConnectRules(behavior);
        this.sourceRules = sourceRules;
        this.targetRules = targetRules;
    }
}
