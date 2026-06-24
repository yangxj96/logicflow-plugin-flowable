import LogicFlow, { CircleNodeModel } from "@logicflow/core";
import { NODE_TYPE_NAMES, NODE_TYPES } from "../../../../core/constants";
import { Property, PropertyMethod } from "../../../../features/schema/types";
import { StartEventSchema } from "../../../../features/schema/nodes/event/start-event";
import { createConnectRules, getNodeBehavior } from "../../../../features/behaviors";
import { BpmnIdGenerator } from "../../../../helper/id-generator";

/**
 * 开始事件节点模型
 *
 * BPMN 规则：
 * - 不允许任何入线
 * - 必须且只能有一条出线
 */
export class StartEventModel extends CircleNodeModel implements PropertyMethod {
    static readonly type = NODE_TYPES.START_EVENT;

    getSchemas(): Property[] {
        return StartEventSchema;
    }

    constructor(data: any, graphModel: any) {
        super(data, graphModel);
        this.r = 26;

        // 开始事件：只出不进（锚点层面阻止入线）
        this.isAllowIncoming = false;
        this.isAllowOutgoing = true;

        // 直接在实例上设置连接规则（避免 LogicFlow 缓存绕过）
        this.applyConnectRules();
    }

    initNodeData(data: LogicFlow.NodeConfig) {
        super.initNodeData(data);

        // 如果导入时已经提供了 form 数据，不再重新构建
        if ((data.properties as any)?.form) {
            data.id = data.id || BpmnIdGenerator.generate();
            data.properties = data.properties || {};
            (data.properties as any).schemas = (data.properties as any).schemas || this.getSchemas();
            return;
        }

        // 初始化赋值
        data.id = BpmnIdGenerator.generate();
        data.text = NODE_TYPE_NAMES[this.type];

        // form构建
        const schemas = this.getSchemas();
        const form: { [key: string]: any } = {};
        for (const schema of schemas) {
            if (schema.field === "id") {
                form[schema.field] = data.id;
                continue;
            }
            if (schema.field === "name") {
                form[schema.field] = data.text;
                continue;
            }
            form[schema.field] = schema.default;
        }

        // 赋值
        data.properties ??= {};
        data.properties["form"] = form;
        data.properties["schemas"] = schemas;
        data.properties["rules"] = {};
    }

    getNodeStyle() {
        return {
            stroke: "#333",
            strokeWidth: 1,
            fill: "#fff"
        };
    }

    /**
     * 应用 BPMN 行为规则到实例的 sourceRules / targetRules
     */
    private applyConnectRules(): void {
        const behavior = getNodeBehavior(this.type);
        if (!behavior) return;

        const { sourceRules, targetRules } = createConnectRules(behavior);
        this.sourceRules = sourceRules;
        this.targetRules = targetRules;
    }
}
