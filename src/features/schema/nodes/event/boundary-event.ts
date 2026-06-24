import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 边界事件 Schema
 */
export const BoundaryEventSchema: Property[] = [
    ...BaseSchema,
    {
        field: "attachedToRef",
        label: "附加到",
        type: "inline",
        component: "string",
        default: ""
    },
    {
        field: "cancelActivity",
        label: "中断活动",
        type: "inline",
        component: "boolean",
        default: "true"
    },
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
        field: "errorEventDefinition",
        label: "错误触发",
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
