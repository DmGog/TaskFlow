import React, {useRef} from "react";
import {FilterValuesType} from "./App";
import {Button} from "./Button";

type TodolistPropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (tasksId: string) => void
    changeFilter: (newFilter: FilterValuesType) => void
    addTask: (title: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


export const Todolist = ({title, tasks, removeTask, changeFilter, addTask}: TodolistPropsType) => {


    const taskInputRef = useRef<HTMLInputElement>(null)

    const tasksElement: Array<JSX.Element> | JSX.Element = tasks.length !== 0 ?


        tasks.map(task => {
            return (
                <li key={task.id}><input type="checkbox" checked={task.isDone}/> <span>{task.title}</span>
                    <Button onClickHandler={() => removeTask(task.id)} title={"x"}/>
                </li>
            )
        }) : <span>нет тасок</span>

    const addTaskHandler = () => {
        if (taskInputRef.current) {
                addTask(taskInputRef.current.value)
            taskInputRef.current.value = ""
        }
    }

    return (

        <div className="todolist">
            <h3>{title}</h3>
            <div>
                <input ref={taskInputRef}/>
                <Button onClickHandler={() => {
                    addTaskHandler()
                }} title={"+"}/>

            </div>
            <ul>
                {tasksElement}
            </ul>
            <div>
                <Button onClickHandler={() => changeFilter("all")} title={"All"}/>
                <Button onClickHandler={() => changeFilter("active")} title={"Active"}/>
                <Button onClickHandler={() => changeFilter("completed")} title={"Completed"}/>
            </div>
        </div>

    );
};
