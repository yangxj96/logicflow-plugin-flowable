# logicflow-plugin-flowable

> 基于 LogicFlow 的 BPMN 2.0 流程建模插件，提供 Flowable 常用节点、拖拽面板、属性面板以及 BPMN XML 导入导出能力。

当前版本：`0.1.1`

## 特性

- 提供 BPMN 2.0 常用事件、任务、网关、子流程和序列流节点
- 提供可拖拽的 DND 组件面板
- 提供流程、节点和连线属性编辑面板
- 支持 Flowable 扩展属性，例如 `flowable:assignee`、`flowable:class`
- 支持 BPMN XML 导入，并自动读取 BPMN DI 坐标或执行基础自动布局
- 支持将当前 LogicFlow 画布导出为 Flowable 可使用的 BPMN 2.0 XML
- 支持通过 LogicFlow 事件接入业务方自己的表单、用户、用户组、Java 类和流程选择器
- 提供 ESM、CJS 和 TypeScript 声明文件

## 安装

使用 pnpm：

```bash
pnpm add @yangxj96/logicflow-plugin-flowable
```

使用 npm：

```bash
npm install @yangxj96/logicflow-plugin-flowable
```

### 对等依赖

请确保宿主项目已经安装以下依赖：

| 包                     | 版本               |
| ---------------------- | ------------------ |
| `@logicflow/core`      | `^2.1.11`          |
| `@logicflow/extension` | `^2.1.11`          |
| `element-plus`         | `^2.13.5`          |
| `vue`                  | `^3.5.30`          |
| `preact`               | `^10.17.1`（可选） |

## 快速开始

### 1. 准备画布和面板容器

插件不会创建外层布局，宿主项目需要自行提供画布、DND 面板和属性面板容器。面板容器及其父级必须有明确高度，否则面板没有可计算的滚动区域。

下面是一个最小的三栏布局：

```html
<div class="flowable-editor">
    <aside id="dnd-panel" class="flowable-panel"></aside>
    <main id="graph" class="flowable-canvas"></main>
    <aside id="property-panel" class="flowable-panel"></aside>
</div>
```

```css
.flowable-editor {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr) 320px;
    width: 100%;
    height: 720px;
    min-height: 0;
}

.flowable-panel,
.flowable-canvas {
    min-width: 0;
    min-height: 0;
    overflow: hidden;
}
```

如果外层使用 `flex` 或 `grid` 布局，请特别保留 `min-height: 0`。DND 和属性面板内部会处理纵向滚动，外层容器建议使用 `overflow: hidden`。

### 2. 创建 LogicFlow 实例并注册插件

```typescript
import LogicFlow from "@logicflow/core";
import Flowable, {
    type FlowablePluginOptions,
    type ImportResult,
    type PickerRequestPayload
} from "@yangxj96/logicflow-plugin-flowable";
import "@yangxj96/logicflow-plugin-flowable/style.css";

const graphContainer = document.querySelector("#graph") as HTMLElement;
const dndContainer = document.querySelector("#dnd-panel") as HTMLElement;
const propertyContainer = document.querySelector("#property-panel") as HTMLElement;

const flowableOptions: FlowablePluginOptions = {
    panel: {
        dnd: dndContainer,
        property: propertyContainer
    },
    pickers: ["form", "user", "group", "javaClass", "process"]
};

const lf = new LogicFlow({
    container: graphContainer,
    plugins: [Flowable.Plugin],
    pluginsOptions: {
        [Flowable.Plugin.pluginName]: flowableOptions
    }
});

lf.render();
```

插件的 `style.css` 已经包含 LogicFlow 核心样式和本插件样式，使用方只需要引入一个 CSS 文件。若项目之前单独引入了 `@logicflow/core/dist/index.css`，请移除该引入，避免样式重复加载。

如果宿主项目还直接使用 `@logicflow/extension` 的 `Control`、`SelectionSelect` 或其他扩展组件，仍需按照扩展包文档单独引入 `@logicflow/extension/dist/index.css`；该样式不属于本插件的合并范围。

插件初始化后会自动完成以下工作：

- 注册 BPMN 节点和序列流
- 将默认边类型设置为 `bpmn:sequenceFlow`
- 启用容器节点的缩放能力
- 注册右键菜单和子流程容器能力
- 在 `graph:rendered` 后挂载 DND 和属性面板

也可以只注册插件而不使用内置面板：

```typescript
const lf = new LogicFlow({
    container: graphContainer,
    plugins: [Flowable.Plugin],
    pluginsOptions: {
        [Flowable.Plugin.pluginName]: {}
    }
});
```

## 插件配置

插件配置类型为 `FlowablePluginOptions`：

```typescript
interface FlowablePluginOptions {
    panel?: {
        dnd?: HTMLElement;
        property?: HTMLElement;
    };
    pickers?: PickerType[];
}
```

### `panel`

| 配置项           | 类型          | 说明                                            |
| ---------------- | ------------- | ----------------------------------------------- |
| `panel.dnd`      | `HTMLElement` | DND 组件面板挂载容器。不配置则不挂载 DND 面板。 |
| `panel.property` | `HTMLElement` | 属性面板挂载容器。不配置则不挂载属性面板。      |

两个面板可以独立配置。例如只需要属性编辑时，可以只传入 `property`。

面板容器应在创建 LogicFlow 实例之前存在，并且父级布局需要提供确定的高度。属性面板和 DND 面板都会根据容器高度自适应，内容超出时在面板内部滚动。

### `pickers`

`pickers` 用于声明宿主项目已经实现的选择器类型：

| 类型        | 用途                    |
| ----------- | ----------------------- |
| `form`      | Flowable 表单或表单定义 |
| `user`      | 用户、指定人、候选人    |
| `group`     | 用户组、候选组          |
| `javaClass` | 服务任务的 Java 实现类  |
| `process`   | 调用活动引用的流程      |

插件只负责发出选择请求，不负责请求业务接口或实现业务弹窗。未加入 `pickers` 的选择器会自动降级为普通文本输入框。

## 接入自定义 Picker

当属性面板中配置了 Picker 类型并且该类型存在于 `pickers` 数组时，用户点击“选择”会触发 LogicFlow 事件 `property:picker`。

事件载荷类型为 `PickerRequestPayload`：

```typescript
interface PickerRequestPayload {
    pickerType: PickerType;
    field: string;
    currentValue: string;
    multiple: boolean;
    nodeId?: string;
    nodeType?: string;
    resolve: (value: string, label?: string) => void;
}
```

宿主项目可以监听事件并打开自己的选择器：

```typescript
type PickerItem = {
    value: string;
    label?: string;
};

lf.on("property:picker", (payload: PickerRequestPayload) => {
    const currentValues = payload.currentValue.split(",").filter(Boolean);

    openBusinessPicker({
        type: payload.pickerType,
        multiple: payload.multiple,
        currentValues,
        nodeId: payload.nodeId,
        nodeType: payload.nodeType,
        onConfirm(items: PickerItem[]) {
            const values = items.map(item => item.value).join(",");
            const labels = items.map(item => item.label ?? item.value).join(",");

            // value 会写入 BPMN 属性，label 只用于属性面板展示。
            payload.resolve(values, labels);
        }
    });
});
```

对于多选 Picker，使用逗号分隔的字符串回填多个值和显示名称。单选 Picker 只需要回填一个元素即可。

内置 schema 中的 Picker 使用位置如下：

| Picker 类型 | 默认使用位置                 |
| ----------- | ---------------------------- |
| `form`      | 开始事件、用户任务的表单 Key |
| `user`      | 用户任务的指定人、候选人     |
| `group`     | 用户任务的候选组             |
| `javaClass` | 服务任务的实现类             |
| `process`   | 调用活动的调用元素           |

如果不需要自定义 Picker，也可以不配置 `pickers`，直接在属性面板中输入原始值。

## DND 组件面板

DND 面板默认按以下分组显示节点，拖动节点到画布即可创建元素：

| 分组   | 节点                                                     |
| ------ | -------------------------------------------------------- |
| 事件   | 开始事件、结束事件、中间捕获事件、中间抛出事件、边界事件 |
| 任务   | 接收任务、脚本任务、服务任务、用户任务                   |
| 网关   | 排他网关、包容网关、并行网关                             |
| 子流程 | 嵌入式子流程、调用活动                                   |

所有节点类型使用 `bpmn:` 前缀，例如 `bpmn:userTask`、`bpmn:exclusiveGateway`。

## 属性面板

属性面板会根据当前画布状态自动切换编辑对象：

- 点击空白区域：编辑流程属性
- 点击节点：编辑节点属性
- 点击连线：编辑连线属性

流程属性包括流程 ID、流程名称、流程分类、流程说明和是否可执行。节点和连线属性会保存到 LogicFlow 元素的 `properties.form` 中，导出 XML 时会读取最新值。

常用属性类型包括：

- `string`：普通文本
- `textarea`：多行文本
- `number`：数字
- `boolean`：布尔开关
- `select`：下拉选项
- `expression`：支持 Flowable 表达式的文本
- `picker`：由宿主项目接管的业务选择器

脚本内容和连线条件表达式会使用 CDATA 方式写入 XML，避免脚本或表达式中的特殊字符破坏 XML 结构。

## BPMN XML 导入导出

### 导出

`toBpmnXml` 接收 LogicFlow 实例，返回 BPMN 2.0 XML 字符串：

```typescript
const xml = Flowable.toBpmnXml(lf);

await saveFile({
    filename: "leave-request.bpmn20.xml",
    content: xml
});
```

导出内容包括：

- 流程级属性和 `isExecutable`
- 节点、节点属性和 Flowable 扩展属性
- 序列流、源节点和目标节点
- 条件表达式、脚本内容和文档说明
- BPMN DI 节点坐标

### 导入

`fromBpmnXml` 接收 XML 字符串和目标 LogicFlow 实例，导入成功后会直接渲染到该实例：

```typescript
const result: ImportResult = Flowable.fromBpmnXml(xmlString, lf);

if (!result.success) {
    console.error(result.message);
} else {
    console.log(result.processName);
    console.log(result.nodes);
    console.log(result.edges);
}
```

`ImportResult` 结构：

```typescript
interface ImportResult {
    success: boolean;
    message: string;
    processName?: string;
    nodes?: any[];
    edges?: any[];
}
```

导入时插件会：

1. 解析并校验 BPMN `definitions` 根元素
2. 查找第一个 `process` 元素并同步流程上下文
3. 读取节点、连线及常用属性
4. 优先使用 BPMN DI 中的节点坐标；没有坐标时执行基础自动布局
5. 将节点和连线渲染到传入的 `lf` 实例

导入接口依赖浏览器的 `DOMParser`，应在浏览器环境中调用。插件支持带命名空间和不带命名空间的常用 BPMN 标签，并兼容将 `manualTask` 映射为用户任务、将 `businessRuleTask` 映射为服务任务。

## 公共 TypeScript 类型

插件入口导出以下公共类型：

```typescript
import type {
    FlowablePluginOptions,
    ImportResult,
    PickerRequestPayload,
    PickerType
} from "@yangxj96/logicflow-plugin-flowable";
```

同时，`Flowable` 默认导出对象包含：

| API                             | 说明             |
| ------------------------------- | ---------------- |
| `Flowable.Plugin`               | LogicFlow 插件类 |
| `Flowable.toBpmnXml(lf)`        | 导出 BPMN XML    |
| `Flowable.fromBpmnXml(xml, lf)` | 导入 BPMN XML    |

## 支持的 BPMN 元素

### 事件

- 开始事件：`bpmn:startEvent`
- 结束事件：`bpmn:endEvent`
- 中间捕获事件：`bpmn:intermediateCatchEvent`
- 中间抛出事件：`bpmn:intermediateThrowEvent`
- 边界事件：`bpmn:boundaryEvent`

### 任务

- 接收任务：`bpmn:receiveTask`
- 脚本任务：`bpmn:scriptTask`
- 服务任务：`bpmn:serviceTask`
- 用户任务：`bpmn:userTask`

### 网关

- 排他网关：`bpmn:exclusiveGateway`
- 包容网关：`bpmn:inclusiveGateway`
- 并行网关：`bpmn:parallelGateway`

### 子流程和连线

- 嵌入式子流程：`bpmn:subProcess`
- 调用活动：`bpmn:callActivity`
- 序列流：`bpmn:sequenceFlow`

## 开发和构建

```bash
# 安装依赖
pnpm install

# 开发监听模式
pnpm run dev

# 构建 ESM、CJS、.d.ts 和 CSS 产物
pnpm run build

# 格式检查
pnpm run format:check

# 运行示例
cd examples
pnpm install
pnpm dev
```

在 `spectra-ui` 中使用本地插件时，可以在插件目录执行 `pnpm run dev`，再启动 `spectra-ui` 开发服务器。

## 版本和变更记录

- 当前版本：`0.1.1`
- 变更记录：[CHANGELOG.md](./CHANGELOG.md)
- 完整变更对比：[v0.1.0...v0.1.1](https://github.com/yangxj96/logicflow-plugin-flowable/compare/v0.1.0...v0.1.1)

## 相关链接

- [LogicFlow](https://logicflow.org/)
- [Flowable](https://www.flowable.org/)
- [GitHub 仓库](https://github.com/yangxj96/logicflow-plugin-flowable)
- [Spectra 流程建模文档](https://github.com/yangxj96/spectra-docs/blob/master/docs/20-%E5%89%8D%E7%AB%AF/30-%E6%B5%81%E7%A8%8B%E5%BB%BA%E6%A8%A1%E6%8F%92%E4%BB%B6.md)

## 许可证

Apache-2.0
