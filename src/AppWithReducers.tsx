import React, {Reducer, useReducer, useState} from "react";
import "./App.css";
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {
    ActionType,
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./redusers/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./redusers/tasks-reducer";

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskStateType = {
    [todolistId: string]: TaskType[]
}

function AppWithReducers() {

    let todolistId1 = v1()
    let todolistId2 = v1()


    const [todolists, dispatchToTodolists] = useReducer<Reducer<TodolistType[], ActionType>>(todolistsReducer,
        [{
            id: todolistId1,
            title: "Что изучили",
            filter: "all"
        }, {
            id: todolistId2,
            title: "Что выучить",
            filter: "all",
        }
        ])

    const [tasks, dispatchToTasks] = useReducer(tasksReducer,
        {
            [todolistId1]: [
                {id: v1(), title: "css", isDone: false},
                {id: v1(), title: "css", isDone: false},
                {id: v1(), title: "css", isDone: false},
            ],
            [todolistId2]: [
                {id: v1(), title: "react", isDone: false},
                {id: v1(), title: "react", isDone: false},
                {id: v1(), title: "react", isDone: false},
            ],
        })

    const updateTodolist = (todolistId: string, title: string) => {
        dispatchToTodolists(changeTodolistTitleAC(todolistId, title))
    }

    const removeTodolist = (todolistId: string) => {
        const action = removeTodolistAC(todolistId)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const addTodolist = (title: string) => {
        const action = addTodolistAC(title)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const changeFilter = (newFilter: FilterValuesType, todolistId: string) => {
        dispatchToTodolists(changeTodolistFilterAC(todolistId, newFilter))
    }

    // tasks
    const removeTask = (tasksId: string, todolistId: string) => {
        dispatchToTasks(removeTaskAC(tasksId, todolistId))
    }

    const addTask = (title: string, todolistId: string) => {
        dispatchToTasks(addTaskAC(title, todolistId))
    }

    const changeTaskStatus = (taskId: string, newIsDone: boolean, todolistId: string) => {
        dispatchToTasks(changeTaskStatusAC(taskId, newIsDone, todolistId))
    }
    const updateTask = (todolistId: string, taskId: string, title: string) => {
        dispatchToTasks(changeTaskTitleAC(taskId, title, todolistId))
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

export default AppWithReducers;
