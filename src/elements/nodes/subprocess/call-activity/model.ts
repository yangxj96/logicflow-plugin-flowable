import LogicFlow, { RectNodeModel } from "@logicflow/core";
import { NODE_TYPES } from "../../../../core/constants";
import { createConnectRules, getNodeBehavior } from "../../../../features/behaviors";

/**
 * 调用活动节点模型
 */
export class CallActivityModel extends RectNodeModel {
    static readonly type = NODE_TYPES.CALL_ACTIVITY;

    constructor(data: any, graphModel: any) {
        super(data, graphModel);
        this.width = 120;
        this.height = 70;
        this.radius = 8;
        this.resizable = false;
        this.isAllowIncoming = true;
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
