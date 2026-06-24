import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 用户任务 Schema
 */
export const UserTaskSchema: Property[] = [
    ...BaseSchema,
    {
        field: "flowable:assignee",
        label: "指定人",
        type: "inline",
        component: "string",
        default: ""
    },
    {
        field: "flowable:candidateUsers",
        label: "候选人",
        type: "inline",
        component: "string",
        default: ""
    },
    {
        field: "flowable:candidateGroups",
        label: "候选组",
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
        field: "flowable:dueDate",
        label: "到期日",
        type: "inline",
        component: "string",
        default: ""
    },
    {
        field: "flowable:priority",
        label: "优先级",
        type: "inline",
        component: "string",
        default: ""
    },
    {
        field: "flowable:category",
        label: "分类",
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
