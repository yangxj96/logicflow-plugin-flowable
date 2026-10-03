# logicflow-plugin-flowable Agent 指令

## 项目边界

- LogicFlow BPMN 2.0 插件，输出 ESM、CJS 和 `.d.ts`。
- 使用项目 mise 固定的 Node/pnpm 和已有 tsup 配置；版本以真实配置及锁文件为准。
- 插件通过 `spectra-ui` 的本地 `file:` 依赖使用；修改插件并联调 Web 时需要先构建或监听构建。
- 工程主标准见 `../docs/开发指南/04-工作区工程标准.md`。当前统一范围为通用工程与宿主边界，流程业务独立治理暂缓；公共变更先完整分析工作区影响再确定必要改造和验证。

## 实现约束

- 文件名使用 kebab-case；公共 API 使用 JSDoc。
- 新增 BPMN 节点时遵循既有基类、目录和聚合器注册方式。
- 保持插件 API 与 Flowable 映射契约；复杂节点行为读取插件领域笔记，不在本文件复制。

## 验证

- 开发中优先执行目标测试或构建；交付前按常见命令文档执行完整门禁。
- 联调说明见 `docs/流程设计器/01-流程建模插件.md`、`README.md` 和 `examples/`。
