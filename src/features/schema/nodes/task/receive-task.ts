import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 接收任务 Schema
 */
export const ReceiveTaskSchema: Property[] = [
    ...BaseSchema,
    {
        field: "flowable:messageRef",
        label: "消息引用",
        type: "inline",
        component: "string",
        default: ""
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
