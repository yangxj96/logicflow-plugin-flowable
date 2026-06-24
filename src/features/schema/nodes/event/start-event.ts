import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 开始事件 Schema
 */
export const StartEventSchema: Property[] = [
    ...BaseSchema,
    {
        field: "flowable:initiator",
        label: "发起人",
        type: "inline",
        component: "string",
        default: ""
    },
    {
        field: "flowable:formKey",
        label: "表单Key",
        type: "inline",
        component: "string",
        default: ""
    },
    {
        field: "document",
        label: "说明",
        type: "children",
        component: "textarea",
        default: ""
    }
];
