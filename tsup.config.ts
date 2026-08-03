import { defineConfig } from "tsup";

export default defineConfig({
    // 入口文件
    entry: ["src/index.ts"],
    // 同时输出 ESM 和 CommonJS
    format: ["esm", "cjs"],
    // 自动生成 .d.ts,包含JSDoc
    dts: true,
    // 调试用
    sourcemap: true,
    clean: true,
    // 压缩 JS，移除所有普通注释
    minify: true,
    esbuildOptions(options) {
        // 仅保留法律声明（如 MIT 许可证），用 /*! ... */ 包裹
        options.legalComments = "inline";
    },
    external: ["vue", "element-plus", "@logicflow/core", "@logicflow/extension"],
    // 将 LogicFlow 核心 CSS 与插件自身 CSS 合并为 dist/index.css
    onSuccess: "node scripts/merge-css.mjs"
});
