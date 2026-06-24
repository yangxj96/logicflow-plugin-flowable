import { defineComponent, h, computed, onMounted, onBeforeUnmount } from "vue";
import { closeContextMenu, contextMenuState as state } from "./menu.state";
import "./menu.ui.css";
import { ContextMenuItem } from "./types";

export const ContextMenu = defineComponent({
    name: "LogicFlowContextMenu",
    setup() {
        const visibleItems = computed(() => state.items.filter(item => !item.show || item.show(state.ctx!)));

        function handleClick(item: ContextMenuItem) {
            if (item.disabled?.(state.ctx!)) return;
            item.onClick(state.ctx!);
            closeContextMenu();
        }

        function onGlobalClick() {
            closeContextMenu();
        }

        onMounted(() => {
            document.addEventListener("click", onGlobalClick);
        });

        onBeforeUnmount(() => {
            document.removeEventListener("click", onGlobalClick);
        });

        return () => {
            if (!state.visible) return null;

            return h(
                "div",
                {
                    class: "lf-context-menu",
                    style: {
                        left: `${state.x}px`,
                        top: `${state.y}px`
                    },
                    onContextmenu: (e: MouseEvent) => e.preventDefault()
                },
                visibleItems.value.map(item =>
                    h(
                        "div",
                        {
                            key: item.key,
                            class: ["lf-context-menu-item", item.disabled?.(state.ctx!) ? "disabled" : ""],
                            onClick: () => handleClick(item)
                        },
                        item.label
                    )
                )
            );
        };
    }
});
