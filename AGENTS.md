# AGENTS.md

## 项目概述

`@yangxj96/logicflow-flowable` 是基于 [LogicFlow](https://logicflow.org) 的 **BPMN 2.0 流程建模插件**，无缝对接 [Flowable](https://www.flowable.org) 工作流引擎。

- 在 spectra-ui 中作为本地 `file:` 引用（`file:../logicflow-flowable`）
- 输出：ESM + CJS + .d.ts（通过 tsup 构建）
- 对等依赖：`@logicflow/core`、`@logicflow/extension`、`element-plus`、`vue`

## 常用命令

- `pnpm run build` — 构建（tsup: ESM + CJS + .d.ts + sourcemap）
- `pnpm run dev` — 开发监听模式
- `pnpm run format` — Prettier 格式化
- `pnpm run format:check` — 检查格式（CI 用）

验证顺序：`format → build`

## 工具链

- Node 24.14.0, pnpm 11.0.9（通过 `mise.toml` 管理）
- TypeScript 5.9, tsup 8.5
- Prettier 3（4 空格缩进，双引号，分号，120 字符行宽）

## 代码规范

- **4 空格缩进**，禁用 Tab。双引号。分号。120 字符行宽。
- `endOfLine: lf`。`arrowParens: avoid`。`trailingComma: none`。
- 文件名：kebab-case（如 `task-base-model.ts`）
- 公共 API 使用 JSDoc 注释

## 项目结构

```
src/
├── index.ts                  # 入口：导出 Flowable.Plugin
├── core/
│   ├── index.ts              # FlowablePlugin 类 — 初始化编排
│   ├── constants.ts          # BPMN 节点类型字符串、显示名称、SVG 图标
│   └── types.ts              # FlowablePluginOptions（面板容器）
├── elements/                 # BPMN 元素（LogicFlow 自定义节点/边）
│   ├── nodes/
│   │   ├── events/           # 开始/结束事件
│   │   ├── tasks/            # 用户/服务/脚本/接收任务
│   │   └── gateways/         # 排他/包容/并行网关
│   └── edges/sequence/       # 序列流
├── panel/
│   ├── dnd/                  # 拖拽组件面板（Vue 3）
│   └── property/             # 属性编辑面板（Vue 3）
├── features/
│   ├── context/process.ts    # 流程元数据
│   ├── context-menu/         # 右键菜单
│   └── schema/               # 属性 schema
└── helper/
    └── id-generator.ts       # BPMN UUID 生成器
```

## 开发工作流

### 在 spectra-ui 中调试

1. 在 `logicflow-flowable/` 执行 `pnpm run dev`（监听模式，自动重新构建）
2. 在 `spectra-ui/` 执行 `pnpm start`
3. 修改 logicflow-flowable 源码后，构建产物会自动更新到 spectra-ui

### 添加新节点

1. 在 `elements/nodes/` 下创建 `model.ts`、`view.ts`、`index.ts`
2. 继承基类（`TaskBaseModel`/`GatewayBaseModel` 等）
3. 在 `core/constants.ts` 添加类型字符串、图标、显示名称
4. 在对应聚合器中注册（如 `registerTaskNodes`）

## 参考文档

- `document/NodeBehaviors.md` — BPMN 验证规则设计文档
- `document/Plans/P-子流程标准化修复计划.md` — 子流程组件标准化修复计划
- `README.md` — 支持的 BPMN 元素矩阵
- `examples/` — 最小可运行示例（Vue 3 + Vite）
