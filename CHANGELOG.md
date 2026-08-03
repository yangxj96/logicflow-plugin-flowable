# Changelog

本项目的全部重要变更记录于此文件。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [0.1.1] - 2026-08-03

### Fixed

- 修复 DND 组件面板超出容器高度后无法滚动的问题
- 补充插件配置、Picker 事件和 BPMN 导入结果的公共 TypeScript 类型导出
- 移除不存在的 `FlowableDesigner` 全局类型声明

## [0.1.0] - 2026-07-26

### Changed

- 包名正式确定为 `@yangxj96/logicflow-plugin-flowable`
- `fromBpmnXml` 参数类型从 `any` 改为 `LogicFlow`，改善 TypeScript 开发体验
- CSS 导出路径新增语义化 `./style.css`（保留 `./dist/index.css` 兼容）
- `preact` 标记为可选 peerDependency（消费者无需手动安装）
- 发布包精确列出产物文件，排除 sourcemap（包体积 118kB → 33kB）

### Added

- `sideEffects` 字段声明，确保打包工具正确处理 CSS
- `engines` 字段（node >= 18）
- README 添加安装说明、对等依赖表、快速开始代码示例

### Removed

- 移除未使用的 `xml-formatter` devDependency

## [0.0.4] - 2026-07-11

### Added

- BPMN XML 导入功能（`fromBpmnXml`）
- 中间事件（捕获/抛出）、边界事件（定时/消息）节点
- 嵌入式子流程、调用活动节点
- 子流程标准化重构（DynamicGroup 容器支持）

### Fixed

- CI 改用 pnpm 安装依赖
- pnpm v11 `allowBuilds` 配置迁移
- 子流程删除递归问题

## [0.0.1] - 2025-12-22

### Added

- 初始发布：BPMN 2.0 流程建模核心功能
- 用户/服务/脚本/接收任务节点
- 排他/并行/包容网关
- 开始/结束事件
- 序列流（条件/默认）
- 拖拽组件面板（DND Panel）
- 属性编辑面板（Property Panel）
- 右键上下文菜单
- 节点行为校验规则
- BPMN XML 导出（`toBpmnXml`）
- ESM + CJS + .d.ts 构建产物
- GitHub Actions 自动发布（npm provenance）
