import { TaskBaseView } from "../task-base-view";
import { NODE_ICONS } from "../../../../core/constants";

/**
 * 脚本任务视图
 */
export class ScriptTaskView extends TaskBaseView {
    getIcon(): string | undefined {
        return NODE_ICONS.SCRIPT_TASK;
    }
}
