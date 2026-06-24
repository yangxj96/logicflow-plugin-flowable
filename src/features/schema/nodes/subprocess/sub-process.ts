import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 嵌入式子流程 Schema
 */
export const SubProcessSchema: Property[] = [
    ...BaseSchema,
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
