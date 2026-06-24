import { TaskBaseView } from "../task-base-view";
import { NODE_ICONS } from "../../../../core/constants";

/**
 * 用户任务视图
 */
export class UserTaskView extends TaskBaseView {
    getIcon(): string | undefined {
        return NODE_ICONS.USER_TASK;
    }
}
