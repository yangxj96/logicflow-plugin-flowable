import LogicFlow from "@logicflow/core";
import { DynamicGroupNodeModel } from "@logicflow/extension";
import { NODE_TYPES } from "../../../../core/constants";
import { createConnectRules, getNodeBehavior } from "../../../../features/behaviors";

/**
 * 嵌入式子流程节点模型
 */
export class SubProcessModel extends DynamicGroupNodeModel {
    static readonly type = NODE_TYPES.SUB_PROCESS;

    constructor(data: any, graphModel: any) {
        super(data, graphModel);
        this.width = 200;
        this.height = 160;
        this.radius = 8;
        this.resizable = true;
        this.isAllowIncoming = true;
        this.isAllowOutgoing = true;
        this.applyConnectRules();
    }

    initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);

        // 确保可缩放、可连线（DynamicGroupNodeModel 可能重置）
        this.resizable = true;
        this.isAllowIncoming = true;
        this.isAllowOutgoing = true;

        // 导入场景：form 数据已存在，无需重建
        if ((data.properties as any)?.form) return;
    }

    setAttributes() {
        super.setAttributes();
        this.resizable = true;
    }

    /** 恢复可见缩放手柄（DynamicGroupNodeModel 默认隐藏了 resize outline） */
    getResizeOutlineStyle() {
        const style = super.getResizeOutlineStyle();
        style.stroke = "#1B7FFF";
        return style;
    }

    /** 恢复可见锚点（DynamicGroupNodeModel 默认隐藏了锚点） */
    getAnchorStyle() {
        const style = super.getAnchorStyle();
        style.stroke = "#1B7FFF";
        style.fill = "#fff";
        if (style.hover) {
            style.hover.fill = "#1B7FFF";
            style.hover.stroke = "#1B7FFF";
        }
        return style;
    }

    private applyConnectRules(): void {
        const behavior = getNodeBehavior(this.type);
        if (!behavior) return;
        const { sourceRules, targetRules } = createConnectRules(behavior);
        this.sourceRules = sourceRules;
        this.targetRules = targetRules;
    }
}
