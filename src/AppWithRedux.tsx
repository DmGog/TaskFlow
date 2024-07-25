import React, {Reducer, useReducer, useState} from "react";
import "./App.css";
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {
    ActionType,
    AddTodolistAC, ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "./redusers/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./redusers/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./redusers/store";

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

    let todolistId1 = v1()
    let todolistId2 = v1()
    let todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
    let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

    const dispatch = useDispatch()

    const updateTodolist = (todolistId: string, title: string) => {
        dispatch(ChangeTodolistTitleAC(todolistId, title))
    }

    const removeTodolist = (todolistId: string) => {
        dispatch(RemoveTodolistAC(todolistId))
    }

    const addTodolist = (title: string) => {
        dispatch(AddTodolistAC(title))
    }

    const changeFilter = (newFilter: FilterValuesType, todolistId: string) => {
        dispatch(ChangeTodolistFilterAC(todolistId, newFilter))
    }

    // tasks
    const removeTask = (tasksId: string, todolistId: string) => {
        dispatch(removeTaskAC(tasksId, todolistId))
    }

    const addTask = (title: string, todolistId: string) => {
        dispatch(addTaskAC(title, todolistId))
    }

    const changeTaskStatus = (taskId: string, newIsDone: boolean, todolistId: string) => {
        dispatch(changeTaskStatusAC(taskId, newIsDone, todolistId))
    }
    const updateTask = (todolistId: string, taskId: string, title: string) => {
        dispatch(changeTaskTitleAC(taskId, title, todolistId))
    }


    const todoListElement = todolists.map(tl => {

        let tasksForTodolist = tasks[tl.id];
        if (tl.filter === "active") {
            tasksForTodolist = tasks[tl.id].filter(t => !t.isDone)
        }
        if (tl.filter === "completed") {
            tasksForTodolist = tasks[tl.id].filter(t => t.isDone)
        }

        return (
            <Todolist
                key={tl.id}
                todolistId={tl.id}
                title={tl.title}
                tasks={tasksForTodolist}
                filter={tl.filter}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeTaskStatus}
                removeTodolist={removeTodolist}
                updateTask={updateTask}
                updateTodolist={updateTodolist}
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
