import React, {ChangeEvent, memo} from "react";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button} from "../../../components/Button";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {useTask} from "./hooks/useTask";

type TaskPropsType = {
    task: TaskType;
    id: string;
};
export const Task = memo(({task, id}: TaskPropsType) => {
    const {updateStatusTask, deleteTask, updateTaskTitle} = useTask(id, task.id);
    const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        updateStatusTask(e.currentTarget.checked);
    };
    return (
        <li>
            <input
                type="checkbox"
                checked={task.status === TaskStatuses.Completed}
                onChange={handleStatusChange}
            />
            <EditableSpan
                className={task.status === TaskStatuses.Completed ? "task-complete" : "task"}
                oldTitle={task.title}
                updateItem={updateTaskTitle}
            />
            <Button onClickHandler={deleteTask} title={"x"}/>
        </li>
    );
});