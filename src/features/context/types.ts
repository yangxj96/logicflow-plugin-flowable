/**
 * 流程模型
 */
export interface ProcessModel {
    /**
     * 流程ID
     */
    id: string;
    /**
     * 流程名称
     */
    name: string;
    /**
     * 流程分类
     */
    category?: string;
    /**
     * 文档
     */
    documentation?: string;
    /**
     * 是否运行
     */
    isExecutable: boolean;
}
