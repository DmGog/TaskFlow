import React from "react";
import {Button} from "./Button";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./redusers/store";
import {TaskStateType, TodolistType} from "./AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./redusers/tasks-reducer";
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./redusers/todolists-reducer";

type TodolistPropsType = {
    todolist: TodolistType
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


export const TodolistRedux = ({
                                  todolist,
                              }: TodolistPropsType) => {

    const {id, title, filter} = todolist

    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id])
    const dispatch = useDispatch()

    const addTaskHandler = (title: string) => {
        dispatch(addTaskAC(title, id))
    }

    const updateTaskHandler = (idTask: string, newTitle: string) => {
        dispatch(changeTaskTitleAC(idTask, newTitle, id))
    }


    if (filter === "active") {
        tasks = tasks.filter(t => !t.isDone)
    }
    if (filter === "completed") {
        tasks = tasks.filter(t => t.isDone)
    }


    const tasksElement: Array<JSX.Element> | JSX.Element = tasks.length !== 0 ?

        tasks.map(task => {
            return (
                <li key={task.id}>
                    <input type="checkbox" checked={task.isDone}
                           onChange={(e) => dispatch(changeTaskStatusAC(task.id, e.currentTarget.checked, id))}/>
                    <EditableSpan className={task.isDone ? "task-complete" : "task"} oldTitle={task.title}
                                  updateItem={(newTitle) => updateTaskHandler(task.id, newTitle)}/>
                    <Button onClickHandler={() => dispatch(removeTaskAC(task.id, id))} title={"x"}/>
                </li>
            )
        }) : <span>нет тасок</span>

    const updateTodolistHandler = (title: string) => {
        dispatch(changeTodolistTitleAC(id, title))
    }

    return (
        <div className="todolist">
            <Button title={"Del Todo"} onClickHandler={() => dispatch(removeTodolistAC(id))}/>
            <h3><EditableSpan oldTitle={title} className={""} updateItem={updateTodolistHandler}/></h3>
            <AddItemForm addItem={addTaskHandler}/>
            <ul>
                {tasksElement}
            </ul>
            <div>
                <Button clas={filter === "all" ? "button-active" : ""}
                        onClickHandler={() => dispatch(changeTodolistFilterAC(id, "all"))}
                        title={"All"}/>
                <Button clas={filter === "active" ? "button-active" : ""}
                        onClickHandler={() => dispatch(changeTodolistFilterAC(id, "active"))}
                        title={"Active"}/>
                <Button clas={filter === "completed" ? "button-active" : ""}
                        onClickHandler={() => dispatch(changeTodolistFilterAC(id, "completed"))} title={"Completed"}/>
            </div>
        </div>

    );
};
