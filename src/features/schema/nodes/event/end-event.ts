import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 结束事件 Schema
 */
export const EndEventSchema: Property[] = [
    ...BaseSchema,
    {
        field: "terminateAll",
        label: "终止全部",
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
