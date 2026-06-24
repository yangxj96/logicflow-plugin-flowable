import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 包容网关 Schema
 *
 * 包容网关用于条件可并行分支：
 * - 至少 2 条出线
 * - 所有出线必须配置条件
 * - 不允许默认连线
 */
export const InclusiveGatewaySchema: Property[] = [
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
