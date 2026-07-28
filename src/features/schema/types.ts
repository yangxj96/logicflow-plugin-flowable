/**
 * 属性组件类型
 */
export type PropertyComponent = "string" | "textarea" | "number" | "boolean" | "select" | "expression" | "picker";

/**
 * 选择器业务类型
 */
export type PickerType = "form" | "user" | "group" | "javaClass" | "process";

/**
 * 选择器请求事件载荷
 */
export interface PickerRequestPayload {
    /** 选择器业务类型 */
    pickerType: PickerType;
    /** 属性字段名 */
    field: string;
    /** 当前值 */
    currentValue: string;
    /** 是否多选 */
    multiple: boolean;
    /** 节点 ID */
    nodeId?: string;
    /** 节点类型 */
    nodeType?: string;
    /** 回填回调（value 存入 BPMN，label 用于面板显示） */
    resolve: (value: string, label?: string) => void;
}

/**
 * 属性验证规则
 */
export interface PropertyRule {
    /**
     * 是否必填
     */
    required?: boolean;
    /**
     * 最小长度
     */
    minLength?: number;
    /**
     * 最大长度
     */
    maxLength?: number;
    /**
     * 正则校验
     */
    pattern?: string;
    /**
     * 校验失败提示
     */
    message?: string;
}

/**
 * Select 选项
 */
export interface PropertyOption {
    label: string;
    value: string;
}

/**
 * 属性
 */
export interface Property {
    /**
     * 字段
     */
    field: string;
    /**
     * 默认值
     */
    default: string;
    /**
     * 显示名称
     */
    label: string;
    /**
     * 属性类型,行内(BPMN元素属性)或者是子节点(BPMN子元素)
     */
    type: "inline" | "children";
    /**
     * 组件类型
     */
    component: PropertyComponent;
    /**
     * 验证规则（可选）
     */
    rules?: PropertyRule;
    /**
     * Select 选项（component 为 "select" 时使用）
     */
    options?: PropertyOption[];
    /**
     * 是否用 CDATA 包裹内容（仅 children 类型有效）
     * 适用于脚本、表达式等可能含 XML 特殊字符的内容
     */
    cdata?: boolean;
    /**
     * 选择器业务类型（component 为 "picker" 时使用）
     */
    pickerType?: PickerType;
    /**
     * 是否多选（picker 模式下）
     */
    pickerMultiple?: boolean;
}

/**
 * 属性必备方法
 */
export interface PropertyMethod {
    /**
     * 获取属性列表
     */
    getSchemas(): Property[];
}
