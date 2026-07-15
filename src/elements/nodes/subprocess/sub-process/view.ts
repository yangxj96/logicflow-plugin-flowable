import { DynamicGroupNode } from "@logicflow/extension";

/**
 * 嵌入式子流程视图
 *
 * 继承 DynamicGroupNode 处理容器逻辑，不重写 getShape 以避免递归
 */
export class SubProcessView extends DynamicGroupNode {
    getResizeControl() {
        const { isCollapsed } = this.props.model;
        if (isCollapsed) return null;
        return super.getResizeControl();
    }
}
