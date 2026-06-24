# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`@yangxj96/logicflow-flowable` is a [LogicFlow](https://logicflow.org) plugin for BPMN 2.0 process modeling targeting Flowable. Users draw flowcharts visually and this plugin generates Flowable-compatible BPMN XML.

Published as an npm package supporting both ESM and CJS via tsup.

## Commands

```bash
# Build (tsup: ESM + CJS + .d.ts, with sourcemaps and minification)
npm run build

# Dev watch mode
npm run dev

# Format code (Prettier)
npm run format

# Check formatting (CI)
npm run format:check

# Run the example app for local debugging
cd examples && npm install && npm run dev
```

There are no tests in this repository yet. The `examples/` Vue 3 + Vite app serves as the manual verification harness.

## Architecture

```
src/
├── index.ts                  # Public API entry point: exports Flowable.Plugin
├── core/
│   ├── index.ts              # FlowablePlugin class — orchestrates init sequence
│   ├── constants.ts          # BPMN node type strings, display names, SVG icons
│   └── types.ts              # FlowablePluginOptions (panel containers)
├── elements/                 # BPMN elements registered as LogicFlow custom nodes/edges
│   ├── nodes/
│   │   ├── events/           # StartEvent, EndEvent (model + view + register)
│   │   ├── tasks/            # User/Service/Script/Receive tasks
│   │   │   ├── task-base-model.ts  # Shared base model (RectNodeModel subclass)
│   │   │   └── task-base-view.ts   # Shared SVG view (header + icon + text layout)
│   │   └── gateways/         # Exclusive/Inclusive/Parallel gateways
│   │       ├── gateway-base-model.ts  # Shared diamond model
│   └── edges/sequence/       # SequenceFlow edge (bpmn:sequenceFlow)
├── panel/
│   ├── dnd/                  # Drag-and-drop component palette (Vue 3)
│   │   ├── index.ts          # registerDndPanel, DND_ITEMS definition
│   │   ├── dnd.ui.ts         # Vue component: grouped collapse panels with drag
│   │   ├── dnd.state.ts      # Reactive state (lf instance + node list)
│   │   └── types.ts
│   └── property/             # Property editing panel (Vue 3)
│       ├── index.ts          # registerPropertyPanel
│       ├── property.ui.ts    # Vue component
│       ├── property.state.ts # Reactive state (mode, currentNode, currentEdge)
│       ├── property.events.ts# LogicFlow event bindings (click/add/delete → state sync)
│       └── renderer/         # Pluggable property field renderers
├── features/
│   ├── context/process.ts    # Process-level metadata (name, id, isExecutable)
│   ├── context-menu/         # Right-click menu for nodes and edges
│   └── schema/               # Property schemas defining editable fields per element type
└── helper/
    └── id-generator.ts       # BPMN UUID generator (prefix-uuidv4 format)
```

### Plugin initialization sequence

`FlowablePlugin` constructor calls `init()` which runs in this order:

1. **`initContext()`** — attaches process metadata (`id`, `name`, `isExecutable`) to the LogicFlow instance via a Symbol-keyed property
2. **`initElements()`** — registers all BPMN node/edge types (events → tasks → edges → gateways)
3. **`initPlugins()`** — registers the right-click context menu (mounts once globally)
4. **`initDefaultConfig()`** — sets default edge type to `bpmn:sequenceFlow`
5. **`bindEvents()`** — on `graph:rendered`, calls `initPanels()` to mount DND and property panels into user-provided DOM containers

### Element pattern (how to add a new node type)

Every BPMN element follows this structure:

1. **Model** (`model.ts`): extends a LogicFlow base model class (`RectNodeModel`, `CircleNodeModel`, `DiamondNodeModel`, or project base classes like `TaskBaseModel` / `GatewayBaseModel`). Sets `type` (the BPMN string from `NODE_TYPES`), dimensions, and connection rules.
2. **View** (`view.ts`): extends a LogicFlow view class (`RectNode`, etc.). Implements `getShape()` returning SVG via LogicFlow's `h()` function.
3. **`index.ts`**: exports a `registerXxx(lf)` function that calls `lf.register({ type, model, view })`.
4. Wire it into the appropriate aggregator in `elements/` (e.g., `registerTaskNodes`).
5. Add the type string to `NODE_TYPES` in `core/constants.ts`, plus icon and display name.

Tasks share `TaskBaseModel`/`TaskBaseView` base classes. Gateways share `GatewayBaseModel`. Events each have their own model/view.

### Vue panel pattern

Panels mount Vue 3 apps into user-provided DOM containers using `createApp(component).mount(container)`. A `WeakMap<HTMLElement, App>` prevents duplicate mounts. State is managed with Vue reactivity (`ref`, `reactive`) — LogicFlow instances are wrapped with `markRaw()` to avoid deep reactivity overhead.

### Peer dependencies

This plugin requires the consumer to provide: `@logicflow/core` ^2.1.11, `@logicflow/extension` ^2.1.11, `element-plus` ^2.13.5, `vue` ^3.5.30. These are marked as `external` in tsup config so they are not bundled.

## Formatting conventions

- Prettier: semicolons on, tab width 4, single quotes off (`"`), trailing commas off, print width 120, bracket same line, arrow parens off
- Codebase uses JSDoc comments on public APIs
- File names use kebab-case (e.g., `task-base-model.ts`)

## Key references

- `document/NodeBehaviors.md` — design document for planned BPMN validation rules (connection constraints, topology checks). Not yet fully implemented in code.
- `README.md` — supported BPMN element matrix showing what's implemented vs planned
