import { RectNodeModel } from "@logicflow/core";
import { createConnectRules, getNodeBehavior } from "../../../features/behaviors";

/**
 * 抽象的任务模型
 */
export class TaskBaseModel extends RectNodeModel {
    constructor(data: any, graphModel: any) {
        super(data, graphModel);

        // BPMN UserTask 标准尺寸
        this.width = 120;
        this.height = 70;
        this.radius = 8;

        // 允许连入 / 连出（任务节点默认双向均可连接）
        this.isAllowIncoming = true;
        this.isAllowOutgoing = true;

        // 直接在实例上设置连接规则（避免 LogicFlow 缓存空数组后绕过 getter）
        this.applyConnectRules();
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
