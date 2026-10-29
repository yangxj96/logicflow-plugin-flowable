import type LogicFlow from "@logicflow/core";
import { defineComponent, getCurrentInstance, onUnmounted } from "vue";
import "./property.ui.css";
import { usePropertyPanel } from "./property.state";
import { registerPropertyEvents } from "./property.events";
import { type PropertyEventOptions, type PropertyPanelControl } from "./types";
import { usePropertyRender } from "./property.render";
import { type PickerType } from "../../features/schema/types";

/**
 * 注册属性面板
 * @param lf LogicFlow实例
 * @param pickers 使用方已实现的选择器类型
 * @param control 面板生命周期控制器
 */
export function createPropertyPanel(lf: LogicFlow, pickers: PickerType[], control: PropertyPanelControl) {
    return defineComponent({
        name: "FlowablePropertyPanel",
        setup() {
            const instance = getCurrentInstance();
            const app = instance?.appContext.app;

            const state = usePropertyPanel(lf, pickers);

            // 注册属性面板切换事件
            const disposeEvents = registerPropertyEvents({
                lf,
                app,
                state
            } as PropertyEventOptions);

            // 创建渲染上下文（computed 在 setup 中创建）
            const { render, syncForm } = usePropertyRender(state);

            const dispose = () => {
                if (state.disposed.value) return;
                state.disposed.value = true;
                state.pickerGuard.dispose();
                syncForm.dispose();
                disposeEvents();
            };

            control.flush = () => syncForm.flush();
            control.dispose = dispose;

            onUnmounted(dispose);

            return render;
        }
    });
}
