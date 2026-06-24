import LogicFlow, { CircleNodeModel } from "@logicflow/core";
import type { ConnectRule } from "@logicflow/core";
import { NODE_TYPES } from "../../../../core/constants";
import { createConnectRules, getNodeBehavior } from "../../../../features/behaviors";

/**
 * 结束事件节点模型
 *
 * BPMN 规则：
 * - 不允许有出线
 * - 允许有入线
 */
export class EndEventModel extends CircleNodeModel {
    static readonly type = NODE_TYPES.END_EVENT;

    constructor(data: any, graphModel: any) {
        super(data, graphModel);
        this.r = 26;

        // 结束事件：只进不出（锚点层面阻止出线）
        this.isAllowIncoming = true;
        this.isAllowOutgoing = false;

        // 直接在实例上设置连接规则（避免 LogicFlow 缓存绕过）
        this.applyConnectRules();
    }

    initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);
    }

    getNodeStyle() {
        return {
            stroke: "#333",
            strokeWidth: 2,
            fill: "#fff"
        };
    }

    /**
     * 应用 BPMN 行为规则到实例的 sourceRules / targetRules
     */
    private applyConnectRules(): void {
        const behavior = getNodeBehavior(this.type);
        if (!behavior) return;

        const { sourceRules, targetRules } = createConnectRules(behavior);
        this.sourceRules = sourceRules;
        this.targetRules = targetRules;
    }
}
