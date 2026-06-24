import { BaseSchema } from "../../base";
import { Property } from "../../types";

/**
 * 并行网关 Schema
 *
 * 并行网关用于并行执行：
 * - 至少 2 条出线
 * - 不允许配置条件
 * - 不允许默认连线
 */
export const ParallelGatewaySchema: Property[] = [
    ...BaseSchema,
    {
        field: "document",
        label: "说明",
        type: "children",
        component: "textarea",
        default: ""
    }
];
