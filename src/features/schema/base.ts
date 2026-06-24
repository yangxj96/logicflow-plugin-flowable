import { Property } from "./types";

/**
 * 基础通用的schema属性
 */
export const BaseSchema: Property[] = [
    {
        field: "id",
        label: "ID",
        type: "inline",
        component: "string",
        default: ""
    },
    {
        field: "name",
        label: "名称",
        type: "inline",
        component: "string",
        default: ""
    }
];
