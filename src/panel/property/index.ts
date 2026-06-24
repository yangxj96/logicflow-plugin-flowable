import { App, createApp } from "vue";
import { PropertyPanelOptions } from "./types";
import { createPropertyPanel } from "./property.ui";
import { registerDefaultsRenderer } from "./renderer";

const appMap = new WeakMap<HTMLElement, App>();

/**
 * 注册属性面板
 * @param lf Logicflow实例
 * @param container 容器
 */
export function registerPropertyPanel({ lf, container }: PropertyPanelOptions): () => void {
    if (!container) return () => {};

    if (appMap.has(container)) {
        return () => {};
    }

    const app = createApp(createPropertyPanel(lf));
    app.mount(container);

    // 注册节点渲染器
    registerDefaultsRenderer();

    appMap.set(container, app);

    return () => {
        app.unmount();
    };
}
