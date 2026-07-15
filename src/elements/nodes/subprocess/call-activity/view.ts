import { h, RectNode } from "@logicflow/core";

/**
 * 调用活动视图 — 粗边框圆角矩形
 */
export class CallActivityView extends RectNode {
    getText() {
        return null;
    }

    getShape() {
        const { x, y, width, height, properties } = this.props.model;
        const textVal = (properties as any)?.form?.name || (properties as any)?.name || "";

        return h("g", {}, [
            h("rect", {
                x: x - width / 2,
                y: y - height / 2,
                width,
                height,
                rx: 4,
                fill: "#fff",
                stroke: "#333",
                strokeWidth: 3
            }),
            // 名称居中
            h(
                "text",
                {
                    x: x,
                    y: y,
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    fill: "#333",
                    fontSize: 13
                },
                textVal
            )
        ]);
    }
}
