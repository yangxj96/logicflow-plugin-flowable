import { Property } from "./types";

/**
 * 流程级别属性 Schema
 */
export const ProcessSchema: Property[] = [
    {
        field: "id",
        label: "流程ID",
        type: "inline",
        component: "string",
        default: "",
        rules: {
            required: true,
            message: "流程ID不能为空"
        }
    },
    {
        field: "name",
        label: "流程名称",
        type: "inline",
        component: "string",
        default: "新建流程",
        rules: {
            required: true,
            message: "流程名称不能为空"
        }
    },
    {
        field: "category",
        label: "流程分类",
        type: "inline",
        component: "string",
        default: ""
    },
    {
        field: "documentation",
        label: "流程说明",
        type: "children",
        component: "textarea",
        default: ""
    },
    {
        field: "isExecutable",
        label: "可执行",
        type: "inline",
        component: "boolean",
        default: "true"
    }
];
