import { type FormModel } from "../../core/domain-types";

/**
 * 防抖持久化控制器
 */
export interface FormSyncController {
    /**
     * 安排一次防抖写入
     * @param model 表单模型
     * @param targetId 发起写入时的目标 ID
     */
    sync(model: FormModel, targetId: string): void;

    /**
     * 立即写入待处理内容
     */
    flush(): void;

    /**
     * 取消待处理写入
     */
    dispose(): void;
}

/**
 * 创建防抖持久化控制器。
 *
 * 目标 ID 在调用 sync 时固定，避免用户切换节点后把旧表单写到新目标；
 * dispose 后不再产生写入，防止销毁后的迟到定时器产生副作用。
 */
export function createFormSync(options: {
    isDisposed: () => boolean;
    write: (targetId: string, model: FormModel) => void;
    delay?: number;
}): FormSyncController {
    const { isDisposed, write, delay = 200 } = options;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let pending: { targetId: string; model: FormModel } | null = null;

    const clear = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        pending = null;
    };

    const flush = () => {
        if (!pending || isDisposed()) {
            clear();
            return;
        }
        const { targetId, model } = pending;
        clear();
        write(targetId, model);
    };

    const sync = (model: FormModel, targetId: string) => {
        if (isDisposed()) return;
        pending = { targetId, model };
        if (timer) clearTimeout(timer);
        timer = setTimeout(flush, delay);
    };

    return {
        sync,
        flush,
        dispose: clear
    };
}
