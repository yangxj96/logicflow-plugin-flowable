import { Component, DiamondNode, h } from "@logicflow/core";

/**
 * 并行网关视图
 */
export abstract class GatewayBaseView extends DiamondNode {
    getText() {
        return null;
    }

    protected abstract renderInnerIcon(
        x: number,
        y: number,
        size: number,
        strokeColor: string,
        strokeWidth: number
    ): Component;

    getShape() {
        const { x, y, width, height, isSelected } = this.props.model;

        const strokeColor = isSelected ? "#409eff" : "#4A90E2";
        const strokeWidth = 2;

        // 菱形四个点
        const points = [
            `${x},${y - height / 2}`,
            `${x + width / 2},${y}`,
            `${x},${y + height / 2}`,
            `${x - width / 2},${y}`
        ].join(" ");

        // X 的尺寸（相对菱形）
        const innerSize = Math.min(width, height) * 0.35;

        return h("g", {}, [
            // 外层菱形
            h("polygon", {
                points,
                fill: "#fff",
                stroke: strokeColor,
                strokeWidth
            }),

            // 中间符号（交给子类）
            this.renderInnerIcon(x, y, innerSize, strokeColor, strokeWidth)
        ]);
    }
}
