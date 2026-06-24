import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 排他网关 Schema
 *
 * 排他网关用于条件互斥分支：
 * - 至少 2 条出线
 * - 每条非默认出线必须配置条件
 * - 必须且只能存在一条默认出线
 */
export const ExclusiveGatewaySchema: Property[] = [
    ...BaseSchema,
    {
        field: "default",
        label: "默认路径",
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
