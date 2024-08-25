import React, {useRef} from "react";
import {Button} from "../components/Button";
import {TaskStatuses, TaskType} from "../api/todolist-api";
import {FilterValuesType} from "../redusers/todolists-reducer";

type TodolistPropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (tasksId: string) => void
    changeFilter: (newFilter: FilterValuesType) => void
    addTask: (title: string) => void
}

export const Todolist = ({title, tasks, removeTask, changeFilter, addTask}: TodolistPropsType) => {


    const taskInputRef = useRef<HTMLInputElement>(null)

    const tasksElement: Array<JSX.Element> | JSX.Element = tasks.length !== 0 ?


        tasks.map(task => {
            return (
                <li key={task.id}><input type="checkbox" checked={task.status === TaskStatuses.Completed}/>
                    <span>{task.title}</span>
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
