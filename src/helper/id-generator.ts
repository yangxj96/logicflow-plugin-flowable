/**
 * BPMN ID生成器
 */
export class BpmnIdGenerator {
    /**
     * 生成符合 BPMN 规范的 UUID 风格 ID
     * @param prefix 前缀，如 nodes / edge / process
     * @returns 唯一 ID，例如 node_3f5b1a2c-4e6f-11ee-be56-0242ac120002
     */
    static generate(prefix: string = ""): string {
        const uuid = this.uuidv4();
        if (prefix !== "") {
            return `${prefix}-${uuid}`;
        }
        return `${uuid}`;
    }

    /**
     * 生成 UUID v4
     */
    private static uuidv4(): string {
        // 生成随机 UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = Math.trunc(Math.random() * 16);
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16).toUpperCase();
        });
    }
}
