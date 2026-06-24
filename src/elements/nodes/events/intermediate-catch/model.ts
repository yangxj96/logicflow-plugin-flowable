import LogicFlow, { CircleNodeModel } from "@logicflow/core";
import { NODE_TYPES } from "../../../../core/constants";
import { createConnectRules, getNodeBehavior } from "../../../../features/behaviors";

/**
 * 中间捕获事件节点模型
 *
 * BPMN 规则：可连入连出（等待触发器）
 */
export class IntermediateCatchEventModel extends CircleNodeModel {
    static readonly type = NODE_TYPES.INTERMEDIATE_CATCH_EVENT;

    constructor(data: any, graphModel: any) {
        super(data, graphModel);
        this.r = 26;
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
