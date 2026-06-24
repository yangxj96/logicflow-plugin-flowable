# 🧩 logicflow-flowable

> 基于 [LogicFlow](https://logicflow.org) 的 **BPMN 2.0 流程图建模插件**，无缝对接 [Flowable](https://www.flowable.org) 工作流引擎。  
> 用 LogicFlow 画流程图，一键导出 Flowable 可直接部署的 BPMN XML！


[![npm version](https://img.shields.io/npm/v/@yangxj96/logicflow-flowable?color=blue)](https://www.npmjs.com/package/@yangxj96/logicflow-flowable)
[![npm downloads](https://img.shields.io/npm/dm/@yangxj96/logicflow-flowable)](https://www.npmjs.com/package/@yangxj96/logicflow-flowable)
[![bundle size](https://badgen.net/bundlephobia/minzip/@yangxj96/logicflow-flowable)](https://bundlephobia.com/package/@yangxj96/logicflow-flowable)
[![License](https://img.shields.io/github/license/yangxj96/logicflow-flowable)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yangxj96/logicflow-flowable?style=social)](https://github.com/yangxj96/logicflow-flowable)

_▲ 支持拖拽节点、属性配置、BPMN XML 导出_

---

## 项目状态说明

当前版本仍在持续完善中，尚未达到生产可用的标准。  
如果你在使用 LogicFlow / Flowable 时也遇到类似需求，  
欢迎在 [GitHub](https://github.com/yangxj96/logicflow-flowable) 为项目点个 ⭐，  
你的支持将是项目持续迭代的重要动力。

---

## 版本策略

该项目采用了简单的版本控制策略:

- `latest`: 可投入生产使用的、推荐的版本
- `dev`: 活跃的开发版本中，API 可能会发生变化
- `alpha`: 实验性或重大变更

在 0.1.0 版本之前，所有版本都被视为**不稳定**的版本。

---

## 🧪 示例（examples）

项目内置了一个 **最小可运行示例**，位于 `examples/` 目录中：

- 基于 **Vue 3**
- 集成 **LogicFlow + logicflow-flowable**
- 用于验证节点渲染、属性面板与 BPMN XML 导出能力

该示例是一个 **完整的前端项目**，适合用于:

- 本地调试插件功能
- 验证新节点/新属性
- 对照理解插件的实际使用方式

### 运行示例

```bash
cd examples
npm install
npm run dev
```

---

## 🧰 支持的 BPMN 元素

以下列表以 **v1.0 覆盖真实 Flowable 项目 90% 使用场景** 为目标进行规划。

### v1.0（核心支持）

#### 事件（Events）

| BPMN 元素       | 状态 | LogicFlow 节点类型                |
|---------------|----|-------------------------------|
| 开始事件          | ✅  | `bpmn:startEvent`             |
| 结束事件          | ✅  | `bpmn:endEvent`               |
| 中间事件（捕获）      | ✅  | `bpmn:intermediateCatchEvent` |
| 中间事件（抛出）      | ✅  | `bpmn:intermediateThrowEvent` |
| 边界事件（定时 / 消息） | ✅  | `bpmn:boundaryEvent`          |

---

#### 任务（Tasks）

| BPMN 元素 | 状态 | LogicFlow 节点类型          |
|---------|----|-------------------------|
| 用户任务    | ✅  | `bpmn:userTask`         |
| 服务任务    | ✅  | `bpmn:serviceTask`      |
| 脚本任务    | ✅  | `bpmn:scriptTask`       |
| 接收任务    | ✅  | `bpmn:receiveTask`      |
| 手工任务    | ✅  | `bpmn:manualTask`       |
| 业务规则任务  | ✅  | `bpmn:businessRuleTask` |

---

#### 网关（Gateways）

| BPMN 元素 | 状态 | LogicFlow 节点类型          |
|---------|----|-------------------------|
| 排他网关    | ✅  | `bpmn:exclusiveGateway` |
| 并行网关    | ✅  | `bpmn:parallelGateway`  |
| 包容网关    | ✅  | `bpmn:inclusiveGateway` |

---

#### 子流程与调用（SubProcess）

| BPMN 元素 | 状态 | LogicFlow 节点类型            |
|---------|----|---------------------------|
| 嵌入式子流程  | ✅  | `bpmn:subProcess`         |
| 展开子流程   | ✅  | `bpmn:expandedSubProcess` |
| 调用活动    | ✅  | `bpmn:callActivity`       |

---

#### 连线（Flows）

| BPMN 元素 | 状态 | LogicFlow 节点类型      |
|---------|----|---------------------|
| 序列流     | ✅  | `bpmn:sequenceFlow` |
| 条件序列流   | ✅  | `bpmn:sequenceFlow` |
| 默认序列流   | ✅  | `bpmn:sequenceFlow` |

---

### ⏳ Planned（规划中）

#### 事件（Events）

- 消息开始事件
- 定时开始事件
- 条件事件
- 信号事件
- 多重事件

---

#### 网关（Gateways）

- 事件网关
- 复杂网关

---

#### 子流程（SubProcess）

- 事件子流程
- 事务子流程

---

#### 协作与泳道（Collaboration）

- Pool（参与者）
- Lane（泳道）
- 消息流（Message Flow）

> ⏳ Planned 功能将根据社区反馈与实际使用情况逐步推进，欢迎提交 Issue 或 PR 参与共建。

---

## 🤝 贡献

欢迎提交 Issue 或 Pull Request！  
在贡献前，请确保:

- 新增节点遵循现有模式
- 提交前运行 `npm run build`
- 更新 README 中的支持列表（如适用）

---

## 📄 License

本项目采用 [Apache License 2.0](LICENSE) 开源协议。  
Copyright © 2025 yangxj96. All rights reserved.

> 本插件仅提供前端建模与 XML 生成能力，不包含 Flowable 引擎本身。
