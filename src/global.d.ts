import type { FlowableDesigner, FlowablePluginOptions } from "./core/types";

declare module "@logicflow/core" {
    interface LogicFlowOptions {
        pluginsOptions?: {
            flowable?: FlowablePluginOptions;
        };
    }
}

declare global {
    // 扩展window对象
    interface Window {
        FlowableDesigner?: FlowableDesigner;
    }
}

export {};
