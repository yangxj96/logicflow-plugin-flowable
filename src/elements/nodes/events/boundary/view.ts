import { CircleNode, h } from "@logicflow/core";

/**
 * 边界事件视图 — 虚线外圆+细线内圆
 */
export class BoundaryEventView extends CircleNode {
    getShape() {
        const { x, y, r } = this.props.model;

        return h("g", {}, [
            h("circle", {
                cx: x,
                cy: y,
                r,
                stroke: "#1B7FFF",
                strokeWidth: 1,
                strokeDasharray: "4,3",
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
