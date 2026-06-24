import { registerPropertyRenderer } from "../index";
import { ElText } from "element-plus";
import { h } from "vue";

/**
 * 注册文本组件渲染器
 */
export function registerTextRenderer() {
    registerPropertyRenderer("text", ({ value }) => {
        return () => {
            const disabled = true;
            return h(
                ElText,
                {
                    disabled
                },
                () => value
            );
        };
    });
}
