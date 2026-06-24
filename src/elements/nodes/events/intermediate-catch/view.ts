import { CircleNode, h } from "@logicflow/core";

/**
 * 中间捕获事件视图 — 双圆细线
 */
export class IntermediateCatchEventView extends CircleNode {
    getShape() {
        const { x, y, r } = this.props.model;

        return h("g", {}, [
            h("circle", {
                cx: x,
                cy: y,
                r,
                stroke: "#1B7FFF",
                strokeWidth: 1,
                fill: "#fff"
            }),
            h("circle", {
                cx: x,
                cy: y,
                r: r - 5,
                stroke: "#1B7FFF",
                strokeWidth: 1,
                fill: "none"
            })
        ]);
    }
}
