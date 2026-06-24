import { TaskBaseView } from "../task-base-view";
import { NODE_ICONS } from "../../../../core/constants";

/**
 * 服务任务视图
 */
export class ServiceTaskView extends TaskBaseView {
    getIcon(): string | undefined {
        return NODE_ICONS.SERVICE_TASK;
    }
}
