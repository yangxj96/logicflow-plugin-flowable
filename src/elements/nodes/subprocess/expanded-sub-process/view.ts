import { DynamicGroupNode } from "@logicflow/extension";

/**
 * 展开子流程视图 — 不显示名称，纯容器
 */
export class ExpandedSubProcessView extends DynamicGroupNode {
    getResizeControl() {
        const { isCollapsed } = this.props.model;
        if (isCollapsed) return null;
        return super.getResizeControl();
    }
}
