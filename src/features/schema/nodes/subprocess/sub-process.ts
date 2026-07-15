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
        field: "flowable:exclusive",
        label: "独占模式",
        type: "inline",
        component: "boolean",
        default: "false"
    },
    {
        field: "flowable:multiInstanceType",
        label: "多实例类型",
        type: "inline",
        component: "select",
        default: "",
        options: [
            { label: "无", value: "" },
            { label: "并行", value: "parallel" },
            { label: "串行", value: "sequential" }
        ]
    },
    {
        field: "document",
        label: "说明",
        type: "children",
        component: "textarea",
        default: ""
    }
];
