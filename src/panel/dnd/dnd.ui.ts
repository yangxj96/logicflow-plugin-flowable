import LogicFlow from "@logicflow/core";
import { ElCard, ElCollapse, ElCollapseItem } from "element-plus";
import { computed, defineComponent, h } from "vue";
import { useDndState } from "./dnd.state";
import "./dnd.ui.css";
import { DndNodeMeta } from "./types";

export function createDndPanel(lf: LogicFlow) {
    return defineComponent({
        name: "FlowableDndPanel",
        setup() {
            // 处理状态
            const state = useDndState(lf);

            // 分组后的节点
            const groups = computed(() => groupByGroup(state.nodes));

            // 默认展开所有分组
            const activeNames = computed(() => groups.value.map(g => g.group));

            // 开始拖拽
            function startDrag(node: any, e: MouseEvent) {
                e.preventDefault();
                if (!state.lf) return;

                state.lf.dnd.startDrag({
                    type: node.type,
                    text: node.label
                });
            }

            // 提取单个网格项的渲染逻辑
            const renderGridItem = (node: any, groupName: string) => {
                return h(
                    "div",
                    {
                        key: node.type,
                        class: "lf-dnd-grid-item",
                        "data-group": groupName,
                        onMousedown: (e: MouseEvent) => startDrag(node, e)
                    },
                    [
                        // 内联 SVG 渲染（继承 CSS color，支持 currentColor）
                        h("span", {
                            class: "lf-dnd-icon",
                            innerHTML: node.icon
                        }),
                        h("span", { class: "lf-dnd-label" }, node.label)
                    ]
                );
            };

            // 提取折叠面板每一项的渲染逻辑
            const renderCollapseItem = (group: any) => {
                return h(
                    ElCollapseItem,
                    {
                        key: group.group,
                        title: group.group,
                        name: group.group
                    },
                    () =>
                        h(
                            "div",
                            { class: "lf-dnd-grid" },
                            group.items.map((item: DndNodeMeta) => renderGridItem(item, group.group))
                        )
                );
            };

            // 主渲染函数
            return () =>
                h(
                    ElCard,
                    {
                        shadow: "never",
                        style: { width: "100%", height: "100%", border: "none" },
                        headerClass: "lf-dnd-header",
                        bodyClass: "lf-dnd-body"
                    },
                    {
                        header: () => h("span", { style: { fontWeight: 600 } }, "组件面板"),
                        default: () =>
                            h(
                                ElCollapse,
                                {
                                    modelValue: activeNames.value,
                                    class: "lf-dnd-collapse"
                                },
                                () => groups.value.map(renderCollapseItem)
                            )
                    }
                );
        }
    });
}

// 根据 group 字段对节点进行分组
function groupByGroup(items: DndNodeMeta[]) {
    const map = new Map<string, DndNodeMeta[]>();

    items.forEach(item => {
        if (!map.has(item.group)) {
            map.set(item.group, []);
        }
        map.get(item.group)!.push(item);
    });

    return Array.from(map.entries()).map(([group, items]) => ({
        group,
        items
    }));
}
