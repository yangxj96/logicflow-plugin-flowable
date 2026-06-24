/**
 * 节点行为规则类型定义
 *
 * 参考 BPMN 2.0 规范：定义每个节点类型的连接能力、拓扑约束及流程合法性规则
 */

/**
 * 节点行为规则
 */
export interface NodeBehavior {
    /** 节点类型 */
    type: string;
    /** 是否允许作为连线起点（source） */
    allowOut: boolean;
    /** 是否允许作为连线终点（target） */
    allowIn: boolean;
    /** 最小出线数（用于图级别校验） */
    minOut: number;
    /** 最大出线数（连线创建时校验） */
    maxOut: number;
    /** 最小入线数（用于图级别校验） */
    minIn: number;
    /** 最大入线数（连线创建时校验） */
    maxIn: number;
    /** 允许的来源节点类型（作为 target 时校验） */
    allowSourceTypes?: string[];
    /** 允许的目标节点类型（作为 source 时校验） */
    allowTargetTypes?: string[];
}
