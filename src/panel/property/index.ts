import { type App, createApp } from "vue";
import { type PropertyPanelOptions } from "./types";
import { createPropertyPanel } from "./property.ui";
import { registerDefaultsRenderer } from "./renderer";

interface PropertyPanelEntry {
    app: App;
    flush: () => void;
    dispose: () => void;
}

/**
 * 已挂载的属性面板
 */
const appMap = new WeakMap<HTMLElement, PropertyPanelEntry>();

/**
 * 属性面板句柄
 */
export interface PropertyPanelHandle {
    /**
     * 立即写入待处理表单
     */
    flush: () => void;

    /**
     * 释放属性面板
     */
    dispose: () => void;
}

/**
 * 注册属性面板
 * @param lf Logicflow实例
 * @param container 容器
 * @param pickers 使用方已实现的选择器类型
 */
export function registerPropertyPanel({ lf, container, pickers }: PropertyPanelOptions): PropertyPanelHandle {
    if (!container) return { flush: () => {}, dispose: () => {} };

    const existing = appMap.get(container);
    if (existing) {
        return { flush: existing.flush, dispose: () => {} };
    }

    let disposed = false;
    const control = {
        flush: () => {},
        dispose: () => {}
    };

    const app = createApp(createPropertyPanel(lf, pickers ?? [], control));
    app.mount(container);

    // 注册节点渲染器
    registerDefaultsRenderer();

    const entry: PropertyPanelEntry = {
        app,
        flush: () => {
            if (!disposed) control.flush();
        },
        dispose: () => {
            if (disposed) return;
            disposed = true;
            control.dispose();
            app.unmount();
            appMap.delete(container);
        }
    };

    appMap.set(container, entry);

    return {
        flush: entry.flush,
        dispose: entry.dispose
    };
}
