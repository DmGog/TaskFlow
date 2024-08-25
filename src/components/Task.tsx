import React, {ChangeEvent, memo, useCallback} from "react";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC} from "../redusers/tasks-reducer";
import {EditableSpan} from "./EditableSpan";
import {Button} from "./Button";
import {TaskStatuses, TaskType} from "../api/todolist-api";

type TaskPropsType = {
    task: TaskType
    id: string
}
export const Task = memo((props: TaskPropsType) => {
    const {task, id} = props
    const dispatch = useDispatch()

    const checkedTask = useCallback((e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New, id)), [dispatch])
    const removeTask = useCallback(() => dispatch(deleteTaskAC(task.id, id)), [dispatch])
    const changeTaskTitle = useCallback((newTitle: string) => dispatch(changeTaskTitleAC(task.id, newTitle, id)), [dispatch])
    return (
        <li>
            <input type="checkbox" checked={task.status === TaskStatuses.Completed} onChange={checkedTask}/>
            <EditableSpan className={task.status === TaskStatuses.Completed ? "task-complete" : "task"}
                          oldTitle={task.title}
                          updateItem={changeTaskTitle}/>
            <Button onClickHandler={removeTask} title={"x"}/>
        </li>)
})