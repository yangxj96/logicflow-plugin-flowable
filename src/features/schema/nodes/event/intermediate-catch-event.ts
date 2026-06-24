import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 中间捕获事件 Schema
 */
export const IntermediateCatchEventSchema: Property[] = [
    ...BaseSchema,
    {
        field: "timerEventDefinition",
        label: "定时触发",
        type: "children",
        component: "boolean",
        default: "false"
    },
    {
        field: "messageEventDefinition",
        label: "消息触发",
        type: "children",
        component: "boolean",
        default: "false"
    },
    {
        field: "signalEventDefinition",
        label: "信号触发",
        type: "children",
        component: "boolean",
        default: "false"
    },
    {
        field: "document",
        label: "说明",
        type: "children",
        component: "textarea",
        default: ""
    }
];
