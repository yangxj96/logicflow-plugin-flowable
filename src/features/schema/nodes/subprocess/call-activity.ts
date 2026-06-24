import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 调用活动 Schema
 */
export const CallActivitySchema: Property[] = [
    ...BaseSchema,
    {
        field: "calledElement",
        label: "调用元素",
        type: "inline",
        component: "string",
        default: ""
    },
    {
        field: "flowable:calledElementType",
        label: "调用类型",
        type: "inline",
        component: "select",
        default: "process",
        options: [
            { label: "流程", value: "process" },
            { label: "案例", value: "case" }
        ]
    },
    {
        field: "flowable:async",
        label: "异步执行",
        type: "inline",
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
