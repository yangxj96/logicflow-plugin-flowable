/**
 * 属性面板当前编辑目标
 */
export interface PropertyTargetKey {
    /**
     * 目标唯一键，包含模式和 ID
     */
    key: string;
    /**
     * 节点 ID
     */
    nodeId?: string;
    /**
     * 节点类型
     */
    nodeType?: string;
}

/**
 * Picker 请求令牌
 */
export interface PickerRequestToken extends PropertyTargetKey {
    /**
     * 请求序号
     */
    requestId: number;

    /**
     * 请求是否仍然有效
     */
    isActive: () => boolean;

    /**
     * 取消请求
     */
    cancel: () => void;

    /**
     * 完成请求
     */
    complete: () => void;
}

/**
 * Picker 请求守卫
 */
export interface PickerRequestGuard {
    /**
     * 发起一次请求
     */
    begin: (target: PropertyTargetKey) => PickerRequestToken;

    /**
     * 使全部未决请求失效
     */
    invalidateAll: () => void;

    /**
     * 销毁并失效全部请求
     */
    dispose: () => void;
}

/**
 * 构造属性面板目标键
 */
export function getPropertyTargetKey(
    mode: "node" | "edge" | "process",
    nodeId?: string,
    edgeId?: string
): PropertyTargetKey {
    if (mode === "node" && nodeId) {
        return { key: `node:${nodeId}`, nodeId };
    }
    if (mode === "edge" && edgeId) {
        return { key: `edge:${edgeId}` };
    }
    return { key: mode };
}

/**
 * 创建 Picker 请求守卫。
 *
 * 同一个目标只接受最新一次请求；目标切换、面板销毁或显式取消后，
 * 旧的 resolve 回调不能再写入表单。
 */
export function createPickerRequestGuard(options: {
    isDisposed: () => boolean;
    currentTargetKey: () => string;
}): PickerRequestGuard {
    const { isDisposed, currentTargetKey } = options;
    let sequence = 0;
    let generation = 0;
    const latestByTarget = new Map<string, number>();
    const active = new Set<number>();

    const begin = (target: PropertyTargetKey): PickerRequestToken => {
        const requestId = ++sequence;
        const requestGeneration = generation;
        latestByTarget.set(target.key, requestId);
        active.add(requestId);

        const isActive = () =>
            !isDisposed() &&
            requestGeneration === generation &&
            active.has(requestId) &&
            latestByTarget.get(target.key) === requestId &&
            currentTargetKey() === target.key;

        const cancel = () => {
            active.delete(requestId);
            if (latestByTarget.get(target.key) === requestId) {
                latestByTarget.delete(target.key);
            }
        };

        return {
            ...target,
            requestId,
            isActive,
            cancel,
            complete: () => {
                active.delete(requestId);
            }
        };
    };

    const invalidateAll = () => {
        generation++;
        active.clear();
        latestByTarget.clear();
    };

    return {
        begin,
        invalidateAll,
        dispose: invalidateAll
    };
}
