import React, {ChangeEvent, memo, useCallback} from "react";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../redusers/tasks-reducer";
import {EditableSpan} from "./EditableSpan";
import {Button} from "./Button";
import {TaskType} from "./TodolistRedux";

type TaskPropsType = {
    task: TaskType
    id: string
}
export const Task = memo((props: TaskPropsType) => {
    const {task, id} = props
    const dispatch = useDispatch()

    const checkedTask = useCallback((e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(task.id, e.currentTarget.checked, id)), [dispatch])
    const removeTask = useCallback(() => dispatch(removeTaskAC(task.id, id)), [dispatch])
    const changeTaskTitle = useCallback((newTitle: string) => dispatch(changeTaskTitleAC(task.id, newTitle, id)), [dispatch])
    return (
        <li>
            <input type="checkbox" checked={task.isDone} onChange={checkedTask}/>
            <EditableSpan className={task.isDone ? "task-complete" : "task"} oldTitle={task.title}
                          updateItem={changeTaskTitle}/>
            <Button onClickHandler={removeTask} title={"x"}/>
        </li>)
})