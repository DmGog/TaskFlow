import React from "react";
import "./App.css";
import {TaskType} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
} from "./redusers/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./redusers/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./redusers/store";
import {TodolistRedux} from "./TodolistRedux";

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskStateType = {
    [todolistId: string]: TaskType[]
}

function AppWithRedux() {

    // let todolistId1 = v1()
    // let todolistId2 = v1()
    let todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)

    const dispatch = useDispatch()
    const addTodolist = (title: string) => {
        dispatch(addTodolistAC(title))
    }

    // const updateTodolist = (todolistId: string, title: string) => {
    //     dispatch(changeTodolistTitleAC(todolistId, title))
    // }
    //
    // const removeTodolist = (todolistId: string) => {
    //     dispatch(removeTodolistAC(todolistId))
    // }
    //
    //
    // const changeFilter = (newFilter: FilterValuesType, todolistId: string) => {
    //     dispatch(changeTodolistFilterAC(todolistId, newFilter))
    // }
    //
    // // tasks
    // const removeTask = (tasksId: string, todolistId: string) => {
    //     dispatch(removeTaskAC(tasksId, todolistId))
    // }
    //
    // const addTask = (title: string, todolistId: string) => {
    //     dispatch(addTaskAC(title, todolistId))
    // }
    //
    // const changeTaskStatus = (taskId: string, newIsDone: boolean, todolistId: string) => {
    //     dispatch(changeTaskStatusAC(taskId, newIsDone, todolistId))
    // }
    // const updateTask = (todolistId: string, taskId: string, title: string) => {
    //     dispatch(changeTaskTitleAC(taskId, title, todolistId))
    // }


    const todoListElement = todolists.map(tl => {

        return (
            <TodolistRedux
                key={tl.id}
                todolist={tl}
            />
        )
    })
    return (
        <div className="App">
            <AddItemForm addItem={addTodolist}/>
            {todoListElement}
        </div>
    );
}

export default AppWithRedux;
