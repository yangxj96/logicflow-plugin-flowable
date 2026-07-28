import LogicFlow from "@logicflow/core";
import { defineComponent, getCurrentInstance } from "vue";
import "./property.ui.css";
import { usePropertyPanel } from "./property.state";
import { registerPropertyEvents } from "./property.events";
import { PropertyEventOptions } from "./types";
import { usePropertyRender } from "./property.render";
import { PickerType } from "../../features/schema/types";

/**
 * 注册属性面板
 * @param lf LogicFlow实例
 * @param pickers 使用方已实现的选择器类型
 */
export function createPropertyPanel(lf: LogicFlow, pickers: PickerType[]) {
    return defineComponent({
        name: "FlowablePropertyPanel",
        setup() {
            const instance = getCurrentInstance();
            const app = instance?.appContext.app;

            const state = usePropertyPanel(lf, pickers);

            // 注册属性面板切换事件
            registerPropertyEvents({
                lf,
                app,
                state
            } as PropertyEventOptions);

            // 创建渲染上下文（computed 在 setup 中创建）
            const { render } = usePropertyRender(state);

            return render;
        }
    });
}
