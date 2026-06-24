import LogicFlow from "@logicflow/core";
import { DynamicGroupNodeModel } from "@logicflow/extension";
import { NODE_TYPES } from "../../../../core/constants";
import { createConnectRules, getNodeBehavior } from "../../../../features/behaviors";

/**
 * 展开子流程节点模型
 */
export class ExpandedSubProcessModel extends DynamicGroupNodeModel {
    static readonly type = NODE_TYPES.EXPANDED_SUB_PROCESS;

    constructor(data: any, graphModel: any) {
        super(data, graphModel);
        this.width = 240;
        this.height = 200;
        this.radius = 8;
        this.resizable = true;
        this.isAllowIncoming = true;
        this.isAllowOutgoing = true;
        this.applyConnectRules();
    }

    initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);

        this.resizable = true;
        this.isAllowIncoming = true;
        this.isAllowOutgoing = true;

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
