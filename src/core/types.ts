import { PickerType } from "../features/schema/types";

/**
 * 插件配置
 */
export interface FlowablePluginOptions {
    panel?: {
        dnd?: HTMLElement;
        property?: HTMLElement;
    };
    /**
     * 使用方已实现的选择器类型（未列出的自动降级为手动输入）
     */
    pickers?: PickerType[];
}
