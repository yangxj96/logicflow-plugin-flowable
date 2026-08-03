import type { FlowablePluginOptions } from "./core/types";

declare module "@logicflow/core" {
    interface LogicFlowOptions {
        pluginsOptions?: {
            flowable?: FlowablePluginOptions;
        };
    }
}

export {};
