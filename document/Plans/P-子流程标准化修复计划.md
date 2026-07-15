# P-子流程标准化修复计划

## 状态

**已完成** - 2026-07-15 执行完毕

## 问题背景

当前逻辑流程图插件中，子流程组件的实现不符合 BPMN 2.0 标准：

1. **`EXPANDED_SUB_PROCESS` 类型不存在于 BPMN 2.0 规范**
   - BPMN 2.0 只定义 `<subProcess>` 元素
   - 展开/折叠是视图层面的行为，不是类型区别
   - 当前实现将"展开子流程"作为独立类型 `bpmn:expandedSubProcess`

2. **导入/导出兼容性问题**
   - 导入标准 BPMN 文件时，`expandedSubProcess` 类型无法正确识别
   - 导出时生成非标准的 `<expandedSubProcess>` 标签

3. **视觉样式问题**
   - SubProcess 使用 `DynamicGroupNode`（无明确边框）
   - BPMN 标准要求加粗边框（与普通任务区分）

4. **Schema 属性不完整**
   - SubProcess 缺少 `flowable:exclusive`、`flowable:multiInstanceType` 等属性

## 修复目标

1. 删除不符合 BPMN 2.0 标准的 `EXPANDED_SUB_PROCESS` 类型
2. 统一使用 `SUB_PROCESS` 类型
3. 保持旧数据兼容（通过导入映射自动转换）
4. 改进 SubProcess 视觉样式
5. 补充 SubProcess Schema 属性

## 详细实现步骤

### 阶段一：删除 EXPANDED_SUB_PROCESS 类型

#### 1.1 修改 `src/core/constants.ts`

**操作**：
- 删除 `EXPANDED_SUB_PROCESS: bpmn("expandedSubProcess")` 常量（第 57 行）
- 删除 `NODE_TYPE_NAMES` 中的 `[NODE_TYPES.EXPANDED_SUB_PROCESS]: "展开子流程"`（第 93 行）
- 删除 `NODE_ICONS` 中的 `EXPANDED_SUB_PROCESS` 图标定义

#### 1.2 删除 Schema 文件

**操作**：
- 删除 `src/features/schema/nodes/subprocess/expanded-sub-process.ts`
- 修改 `src/features/schema/index.ts`：
  - 删除 `ExpandedSubProcessSchema` 的导入和导出
  - 删除 `schemaRegistry` 中的 `[NODE_TYPES.EXPANDED_SUB_PROCESS]: ExpandedSubProcessSchema`

#### 1.3 删除节点实现文件

**操作**：
- 删除 `src/elements/nodes/subprocess/expanded-sub-process/` 整个目录（model.ts、view.ts、index.ts）

#### 1.4 修改行为规则

**操作**：
- 修改 `src/features/behaviors/index.ts`：
  - 删除 `NODE_BEHAVIORS` 中的 `EXPANDED_SUB_PROCESS` 条目（第 76-84 行）

### 阶段二：修复导入映射

#### 2.1 修改 `src/features/import/types.ts`

**操作**：
- 将 `expandedSubProcess: "bpmn:expandedSubProcess"` 改为 `expandedSubProcess: "bpmn:subProcess"`

**效果**：导入包含 `<expandedSubProcess>` 的旧 BPMN 文件时，会自动映射为 `SUB_PROCESS` 类型。

### 阶段三：修复导出映射

#### 3.1 修改 `src/features/export/types.ts`

**操作**：
- 删除 `"bpmn:expandedSubProcess": "expandedSubProcess"` 映射

**效果**：导出时不会生成非标准的 `<expandedSubProcess>` 标签。

### 阶段四：修改 DND 面板

#### 4.1 修改 `src/panel/dnd/index.ts`

**操作**：
- 删除 `DND_ITEMS` 中的展开子流程条目（第 70-75 行）

### 阶段五：SubProcess 视觉样式改进

#### 5.1 修改 SubProcess 视图

**操作**：
- 修改 `src/elements/nodes/subprocess/sub-process/view.ts`：
  - 继承 `DynamicGroupNode`（保持容器功能）
  - 添加加粗边框样式（`strokeWidth: 2`）
  - 添加默认填充色（`fill: "#fff"`）

**预期效果**：
```typescript
export class SubProcessView extends DynamicGroupNode {
    getShape() {
        // 调用父类获取基础形状
        // 添加加粗边框
    }
}
```

### 阶段六：SubProcess Schema 补充

#### 6.1 修改 SubProcess Schema

**操作**：
- 修改 `src/features/schema/nodes/subprocess/sub-process.ts`：
  - 添加 `flowable:exclusive`（独占模式）
  - 添加 `flowable:multiInstanceType`（多实例类型，可选值：`parallel`、`sequential`）

**新增属性**：
```typescript
{
    field: "flowable:exclusive",
    label: "独占模式",
    type: "inline",
    component: "boolean",
    default: "false"
},
{
    field: "flowable:multiInstanceType",
    label: "多实例类型",
    type: "inline",
    component: "select",
    default: "",
    options: [
        { label: "无", value: "" },
        { label: "并行", value: "parallel" },
        { label: "串行", value: "sequential" }
    ]
}
```

### 阶段七：更新文档

#### 7.1 更新 NodeBehaviors.md

**操作**：
- 修改 `document/NodeBehaviors.md`：
  - 删除展开子流程的行为规则描述
  - 更新子流程的行为规则描述

## 文件变更清单

| 操作 | 文件路径 |
|------|----------|
| 删除 | `src/elements/nodes/subprocess/expanded-sub-process/` 目录 |
| 删除 | `src/features/schema/nodes/subprocess/expanded-sub-process.ts` |
| 修改 | `src/core/constants.ts` |
| 修改 | `src/features/schema/index.ts` |
| 修改 | `src/features/schema/nodes/subprocess/sub-process.ts` |
| 修改 | `src/features/behaviors/index.ts` |
| 修改 | `src/features/import/types.ts` |
| 修改 | `src/features/export/types.ts` |
| 修改 | `src/panel/dnd/index.ts` |
| 修改 | `src/elements/nodes/subprocess/sub-process/view.ts` |
| 修改 | `document/NodeBehaviors.md` |

## 验证步骤

1. **构建验证**：`pnpm run build` 确保无 TypeScript 错误
2. **导入测试**：导入包含 `<expandedSubProcess>` 的旧 BPMN 文件，验证自动转换为 `subProcess`
3. **导出测试**：导出包含子流程的流程图，验证 XML 结构正确
4. **视觉测试**：检查子流程节点显示加粗边框

## 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 旧数据兼容性 | 已保存的 `expandedSubProcess` 数据无法识别 | 导入映射修复，自动转换为 `subProcess` |
| 用户习惯 | 用户需要适应新的子流程类型 | 视觉样式保持一致，仅类型统一 |

## 参考资料

- BPMN 2.0 规范：https://www.omg.org/spec/BPMN/2.0
- Flowable 文档：https://www.flowable.com/open-source/docs/bpmn/ch07b-Flowable-BPMN-Extensions
- NodeBehaviors.md — BPMN 验证规则设计文档
