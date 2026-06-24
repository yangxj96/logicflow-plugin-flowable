import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 脚本任务 Schema
 */
export const ScriptTaskSchema: Property[] = [
    ...BaseSchema,
    {
        field: "scriptFormat",
        label: "脚本格式",
        type: "inline",
        component: "select",
        default: "groovy",
        options: [
            { label: "Groovy", value: "groovy" },
            { label: "JavaScript", value: "javascript" },
            { label: "JUEL", value: "juel" }
        ]
    },
    {
        field: "script",
        label: "脚本内容",
        type: "children",
        component: "textarea",
        default: "",
        cdata: true,
        rules: {
            required: true,
            message: "脚本内容不能为空"
        }
    },
    {
        field: "flowable:resultVariable",
        label: "结果变量",
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
