import React, {ChangeEvent, useState, KeyboardEvent, useRef} from "react";
import {FilterValuesType} from "./App";
import {Button} from "./Button";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";

type TodolistPropsType = {
    todolistId: string
    title: string
    filter: FilterValuesType
    tasks: TaskType[]
    removeTask: (tasksId: string, todolistId: string) => void
    changeFilter: (newFilter: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    updateTask: (todolistId: string, taskId: string, newTitle: string) => void
    updateTodolist: (todolistId: string, newTitle: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


export const Todolist = ({
                             title,
                             tasks,
                             removeTask,
                             changeFilter,
                             addTask,
                             changeTaskStatus,
                             filter,
                             removeTodolist,
                             todolistId,
                             updateTask,
                             updateTodolist
                         }: TodolistPropsType) => {

    const addTaskHandler = (title: string) => {
        addTask(title, todolistId)
    }

    const updateTaskHandler = (idTask: string, newTitle: string) => {
        updateTask(todolistId, idTask, newTitle)
    }


    const tasksElement: Array<JSX.Element> | JSX.Element = tasks.length !== 0 ?

        tasks.map(task => {
            // const updateTaskHandler = (newTitle: string) => {
            //     updateTask(todolistId, task.id, newTitle)
            // }
            return (
                <li key={task.id}>
                    <input type="checkbox" checked={task.isDone}
                           onChange={(e) => changeTaskStatus(task.id, e.currentTarget.checked, todolistId)}/>
                    <EditableSpan className={task.isDone ? "task-complete" : "task"} oldTitle={task.title}
                                  updateItem={(newTitle) => updateTaskHandler(task.id, newTitle)}/>
                    <Button onClickHandler={() => removeTask(task.id, todolistId)} title={"x"}/>
                </li>
            )
        }) : <span>нет тасок</span>

    const updateTodolistHandler = (title: string) => {
        updateTodolist(todolistId, title)
    }


    return (
        <div className="todolist">
            <Button title={"Del Todo"} onClickHandler={() => removeTodolist(todolistId)}/>
            <h3><EditableSpan oldTitle={title} className={""} updateItem={updateTodolistHandler}/></h3>
            <AddItemForm addItem={addTaskHandler}/>
            <ul>
                {tasksElement}
            </ul>
            <div>
                <Button clas={filter === "all" ? "button-active" : ""}
                        onClickHandler={() => changeFilter("all", todolistId)}
                        title={"All"}/>
                <Button clas={filter === "active" ? "button-active" : ""}
                        onClickHandler={() => changeFilter("active", todolistId)}
                        title={"Active"}/>
                <Button clas={filter === "completed" ? "button-active" : ""}
                        onClickHandler={() => changeFilter("completed", todolistId)} title={"Completed"}/>
            </div>
        </div>

    );
};
