import { DynamicGroupNode } from "@logicflow/extension";

/**
 * 嵌入式子流程视图 — 不显示名称，纯容器
 */
export class SubProcessView extends DynamicGroupNode {
    getResizeControl() {
        const { isCollapsed } = this.props.model;
        if (isCollapsed) return null;
        return super.getResizeControl();
    }
}
