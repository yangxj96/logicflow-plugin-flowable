import { TaskBaseView } from "../task-base-view";
import { NODE_ICONS } from "../../../../core/constants";

/**
 * 接收任务视图
 */
export class ReceiveTaskView extends TaskBaseView {
    getIcon(): string | undefined {
        return NODE_ICONS.RECEIVE_TASK;
    }
}
