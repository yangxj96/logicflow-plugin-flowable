import { DiamondNodeModel } from "@logicflow/core";
import { createConnectRules, getNodeBehavior } from "../../../features/behaviors";

/**
 * 网关通用基类模型
 */
export class GatewayBaseModel extends DiamondNodeModel {
    constructor(data: any, graphModel: any) {
        super(data, graphModel);

        this.resizable = false;
        // 网关允许连入和连出
        this.isAllowIncoming = true;
        this.isAllowOutgoing = true;

        // 直接在实例上设置连接规则
        this.applyConnectRules();
    }

    override initNodeData(data: any) {
        super.initNodeData(data);

        this.setProperties({
            rx: 24,
            ry: 24
        });
    }

    /**
     * 应用 BPMN 行为规则到实例的 sourceRules / targetRules
     * 必须在 constructor 中调用（super() 之后），因为 LogicFlow 会缓存 first-call 结果
     */
    private applyConnectRules(): void {
        const behavior = getNodeBehavior(this.type);
        if (!behavior) return;

        const { sourceRules, targetRules } = createConnectRules(behavior);
        this.sourceRules = sourceRules;
        this.targetRules = targetRules;
    }
}
