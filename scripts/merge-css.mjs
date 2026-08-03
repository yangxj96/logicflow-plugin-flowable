import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const coreCssPath = require.resolve("@logicflow/core/dist/index.css");
const pluginCssPath = fileURLToPath(new URL("../dist/index.css", import.meta.url));

function removeSourceMapComment(css) {
    return css.replace(/\s*\/\*# sourceMappingURL=.*?\*\/\s*$/u, "");
}

const coreCss = removeSourceMapComment(readFileSync(coreCssPath, "utf8"));
const pluginCss = removeSourceMapComment(readFileSync(pluginCssPath, "utf8"));

writeFileSync(
    pluginCssPath,
    ["/* LogicFlow core styles */", coreCss, "/* logicflow-plugin-flowable styles */", pluginCss, ""].join("\n"),
    "utf8"
);

console.log(`Merged LogicFlow core CSS into ${pluginCssPath}`);
