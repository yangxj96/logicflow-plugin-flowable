/**
 * 插件名称
 */
export const PLUGIN_NAME = "flowable";

/**
 * BPMN前缀
 */
export const BPMN_PREFIX = `bpmn` as const;

/**
 * BPMN nodes type 构建
 */
const bpmn = <T extends string>(name: T) => `${BPMN_PREFIX}:${name}` as const;

/**
 * 支持的所有BPMN节点
 */
export const NODE_TYPES = {
    /*--------------连线--------------*/
    SEQUENCE_FLOW: bpmn("sequenceFlow"),

    /*--------------任务--------------*/
    // 接收任务
    RECEIVE_TASK: bpmn("receiveTask"),
    // 脚本任务
    SCRIPT_TASK: bpmn("scriptTask"),
    // 服务任务
    SERVICE_TASK: bpmn("serviceTask"),
    // 用户任务
    USER_TASK: bpmn("userTask"),

    /*--------------事件--------------*/
    // 开始事件
    START_EVENT: bpmn("startEvent"),
    // 结束事件
    END_EVENT: bpmn("endEvent"),

    /*--------------网关--------------*/
    // 排他网关
    EXCLUSIVE_GATEWAY: bpmn("exclusiveGateway"),
    // 包容网关
    INCLUSIVE_GATEWAY: bpmn("inclusiveGateway"),
    // 并行网关
    PARALLEL_GATEWAY: bpmn("parallelGateway"),

    /*--------------特殊处理--------------*/
    // 流程定义
    PROCESS: bpmn("process")
} as const;

/**
 * 节点类型名称
 */
export const NODE_TYPE_NAMES: Record<string, string> = {
    /*--------------连线--------------*/
    [NODE_TYPES.SEQUENCE_FLOW]: "顺序流",

    /*--------------任务--------------*/
    [NODE_TYPES.RECEIVE_TASK]: "接收任务",
    [NODE_TYPES.SCRIPT_TASK]: "脚本任务",
    [NODE_TYPES.SERVICE_TASK]: "服务任务",
    [NODE_TYPES.USER_TASK]: "用户任务",

    /*--------------事件--------------*/
    [NODE_TYPES.START_EVENT]: "开始事件",
    [NODE_TYPES.END_EVENT]: "结束事件",

    /*--------------网关--------------*/
    [NODE_TYPES.EXCLUSIVE_GATEWAY]: "排他网关",
    [NODE_TYPES.INCLUSIVE_GATEWAY]: "包容网关",
    [NODE_TYPES.PARALLEL_GATEWAY]: "并行网关",

    /*--------------特殊--------------*/
    [NODE_TYPES.PROCESS]: "流程"
};

/**
 * 节点图标（内联 SVG 字符串，使用 currentColor 以便在不同上下文中自适应颜色）
 *
 * 图标设计遵循 BPMN 2.0 视觉约定：
 * - 事件：圆形（开始=细线、结束=粗线）
 * - 任务：圆角矩形（不同类型用内部图标区分）
 * - 网关：菱形（排他=X、并行=+、包容=○）
 */
export const NODE_ICONS = {
    /*--------------事件--------------*/
    START_EVENT:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5" />' +
        "</svg>",

    END_EVENT:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="4" />' +
        "</svg>",

    /*--------------任务--------------*/
    RECEIVE_TASK:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" />' +
        '<polyline points="3,6 12,13 21,6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />' +
        "</svg>",

    SCRIPT_TASK:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" />' +
        '<path d="M8 9h6M8 13h4M8 17h5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />' +
        "</svg>",

    SERVICE_TASK:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" />' +
        '<circle cx="12" cy="10" r="2" fill="none" stroke="currentColor" stroke-width="1.5" />' +
        '<path d="M12 6v1M12 17v1M6 12h1M17 12h1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />' +
        "</svg>",

    USER_TASK:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" />' +
        '<circle cx="12" cy="9.5" r="3" fill="none" stroke="currentColor" stroke-width="1.5" />' +
        '<path d="M6.5 19c0-3 11-3 11 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />' +
        "</svg>",

    /*--------------网关--------------*/
    EXCLUSIVE_GATEWAY:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />' +
        '<line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />' +
        '<line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />' +
        "</svg>",

    INCLUSIVE_GATEWAY:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />' +
        '<circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5" />' +
        "</svg>",

    PARALLEL_GATEWAY:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />' +
        '<line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />' +
        '<line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />' +
        "</svg>"
} as const;

/**
 * 将内联 SVG 字符串转换为 data URI（用于 SVG &lt;image&gt; 元素的 href）
 */
export function svgToDataUri(svg: string): string {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
