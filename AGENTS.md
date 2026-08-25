# logicflow-plugin-flowable Agent 指令

## 项目边界

- LogicFlow BPMN 2.0 插件，输出 ESM、CJS 和 `.d.ts`。
- 使用 Node 24.14.0、pnpm 11.0.9 和项目已有的 tsup 配置。
- 插件通过 `spectra-ui` 的本地 `file:` 依赖使用；修改插件并联调 Web 时需要先构建或监听构建。

## 实现约束

- 文件名使用 kebab-case；公共 API 使用 JSDoc。
- 新增 BPMN 节点时遵循既有基类、目录和聚合器注册方式。
- 保持插件 API 与 Flowable 映射契约；复杂节点行为读取插件领域笔记，不在本文件复制。

## 验证

- 开发中优先执行目标测试或 `pnpm run build`。
- 交付前按需执行 `pnpm run format:check` 和 `pnpm run build`。
- 联调说明见 `docs/20-前端/30-流程建模插件.md`、`README.md` 和 `examples/`。
