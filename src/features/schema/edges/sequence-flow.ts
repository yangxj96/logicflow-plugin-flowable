import { BaseSchema } from "../base";
import { Property } from "../types";

/**
 * 序列流（连线）Schema
 */
export const SequenceFlowSchema: Property[] = [
    ...BaseSchema,
    {
        field: "sourceRef",
        label: "源节点",
        type: "inline",
        component: "string",
        default: "",
        rules: {
            required: true
        }
    },
    {
        field: "targetRef",
        label: "目标节点",
        type: "inline",
        component: "string",
        default: "",
        rules: {
            required: true
        }
    },
    {
        field: "conditionExpression",
        label: "条件表达式",
        type: "children",
        component: "expression",
        default: "",
        cdata: true
    },
    {
        field: "skipExpression",
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
