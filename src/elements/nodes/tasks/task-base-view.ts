import { h, RectNode } from "@logicflow/core";
import { svgToDataUri } from "../../../core/constants";

/**
 * 抽象的任务视图
 */
export class TaskBaseView extends RectNode {
    // 头部高度
    static readonly HEADER_HEIGHT: number = 28;
    // 内边距
    static readonly PADDING: number = 8;
    // 图标大小
    static readonly ICON_SIZE: number = 14;
    // 图标与文字之间的间隔
    static readonly ICON_TEXT_GAP: number = 16;

    getText() {
        return null;
    }

    getIcon(): string | undefined {
        return undefined;
    }

    getShape() {
        const { x, y, width, height, text, properties } = this.props.model;

        // 计算icon位置
        const icon = this.getIcon();
        const startX = x - width / 2 + TaskBaseView.PADDING;
        const centerY = y - height / 2 + TaskBaseView.HEADER_HEIGHT / 2;

        return h("g", {}, [
            // 外框
            h("rect", {
                x: x - width / 2,
                y: y - height / 2,
                width,
                height,
                rx: 4,
                fill: "#fff",
                stroke: "#5BB6F0"
            }),
            // 头部
            h("rect", {
                x: x - width / 2,
                y: y - height / 2,
                width,
                height: TaskBaseView.HEADER_HEIGHT,
                fill: "#5BB6F0"
            }),
            // 头部图标
            icon &&
                h("image", {
                    href: svgToDataUri(icon),
                    x: startX,
                    y: centerY - TaskBaseView.ICON_SIZE / 2,
                    width: TaskBaseView.ICON_SIZE,
                    height: TaskBaseView.ICON_SIZE,
                    preserveAspectRatio: "xMidYMid meet",
                    style: {
                        color: "#fff",
                        pointerEvents: "none"
                    }
                }),
            // 头部标题（text.value）
            h(
                "text",
                {
                    x: x - width / 2 + TaskBaseView.PADDING + (icon ? TaskBaseView.ICON_TEXT_GAP : 0),
                    y: y - height / 2 + TaskBaseView.HEADER_HEIGHT / 2 + 6,
                    fill: "#fff",
                    fontSize: 14
                },
                text.value
            ),
            // 正文（优先读取 form.name，其次 properties.name，最后用 text.value）
            h(
                "text",
                {
                    x: x,
                    y: y - height / 2 + TaskBaseView.HEADER_HEIGHT + (height - TaskBaseView.HEADER_HEIGHT) / 2,
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    fill: "#333",
                    fontSize: 14
                },
                properties?.form?.name || properties?.name || text.value || ""
            )
        ]);
    }
}
