import { BaseSchema } from "../../base";
import { type Property } from "../../types";

/**
 * 服务任务 Schema
 */
export const ServiceTaskSchema: Property[] = [
    ...BaseSchema,
    {
        field: "flowable:class",
        label: "实现类",
        type: "inline",
        component: "picker",
        pickerType: "javaClass",
        default: ""
    },
    {
        field: "flowable:delegateExpression",
        label: "委托表达式",
        type: "inline",
        component: "expression",
        default: ""
    },
    {
        field: "flowable:expression",
        label: "表达式",
        type: "inline",
        component: "expression",
        default: ""
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
        field: "flowable:skipExpression",
        label: "跳过表达式",
        type: "inline",
        component: "expression",
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
