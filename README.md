# logicflow-plugin-flowable

> 基于 LogicFlow 的 BPMN 2.0 流程图建模插件，无缝对接 Flowable 工作流引擎。
> 用 LogicFlow 画流程图，一键导出 Flowable 可直接部署的 BPMN XML。

## 技术栈

| 技术 | 版本 | 说明 |
|---|---|---|
| TypeScript | 5.9.3 | 类型系统 |
| tsup | 8.5.1 | 构建工具（ESM + CJS + .d.ts） |
| LogicFlow | ^2.1.11 | 流程图引擎（对等依赖） |
| Vue | ^3.5.30 | 渲染层（对等依赖） |
| Element Plus | ^2.13.5 | UI 组件（对等依赖） |

## 支持的 BPMN 元素

**事件**：开始事件、结束事件、中间事件（捕获/抛出）、边界事件（定时/消息）

**任务**：用户任务、服务任务、脚本任务、接收任务、手工任务、业务规则任务

**网关**：排他网关、并行网关、包容网关

**子流程与调用**：嵌入式子流程、调用活动

**连线**：序列流、条件序列流、默认序列流

**规划中**：事件网关、复杂网关、事件子流程、事务子流程、Pool/Lane、消息流

## 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式（监听文件变化自动重新构建）
pnpm run dev

# 构建
pnpm run build

# 运行示例
cd examples && pnpm install && pnpm dev
```

## 版本策略

| 标签 | 说明 |
|---|---|
| `latest` | 可投入生产使用的版本 |
| `dev` | 活跃的开发版本 |
| `alpha` | 实验性或重大变更 |

## 文档

项目文档统一维护在根仓库 [spectra-docs](https://github.com/yangxj96/spectra-docs)：

| 文档 | 路径 |
|---|---|
| 流程建模插件 | `docs/20-前端/30-流程建模插件.md` |
| 工作流模块 | `docs/10-后端/60-工作流.md` |
| 执行计划 | `docs/98-计划/logicflow-flowable/P-子流程标准化修复计划.md` |

## 许可证

Apache-2.0
