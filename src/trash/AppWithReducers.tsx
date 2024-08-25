import React, {Reducer, useReducer} from "react";
import "../App.css";
import {Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "../components/AddItemForm";
import {
    ActionsType,
    changeTodolistFilterAC,
    createTodolistAC,
    deleteTodolistAC,
    FilterValuesType,
    TodolistDomainType,
    todolistsReducer,
    updateTodolistTitleAC
} from "../redusers/todolists-reducer";
import {
    changeTaskStatusAC,
    changeTaskTitleAC,
    createTaskAC,
    deleteTaskAC,
    tasksReducer
} from "../redusers/tasks-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/todolist-api";

function AppWithReducers() {

    let todolistId1 = v1()
    let todolistId2 = v1()


    const [todolists, dispatchToTodolists] = useReducer<Reducer<TodolistDomainType[], ActionsType>>(todolistsReducer,
        [{
            id: todolistId1,
            title: "Что изучили",
            filter: "all",
            addedDate: "",
            order: 0
        }, {
            id: todolistId2,
            title: "Что выучить",
            filter: "all",
            addedDate: "",
            order: 0
        }
        ])

    const [tasks, dispatchToTasks] = useReducer(tasksReducer,
        {
            [todolistId1]: [
                {
                    id: v1(), title: "css",
                    status: TaskStatuses.New,
                    order: 0,
                    addedDate: "",
                    startDate: "",
                    priority: TaskPriorities.Later,
                    deadline: "",
                    description: "",
                    todoListId: todolistId1
                },

            ],
            [todolistId2]: [
                {
                    id: v1(), title: "react",
                    status: TaskStatuses.New,
                    order: 0,
                    addedDate: "",
                    startDate: "",
                    priority: TaskPriorities.Later,
                    deadline: "",
                    description: "",
                    todoListId: todolistId2
                },

            ],
        })

    const updateTodolist = (todolistId: string, title: string) => {
        dispatchToTodolists(updateTodolistTitleAC(todolistId, title))
    }

    const removeTodolist = (todolistId: string) => {
        const action = deleteTodolistAC(todolistId)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const addTodolist = (title: string) => {
        const action = createTodolistAC({id: v1(), title, addedDate: "d", order: 0})
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const changeFilter = (newFilter: FilterValuesType, todolistId: string) => {
        dispatchToTodolists(changeTodolistFilterAC(todolistId, newFilter))
    }

    // tasks
    const removeTask = (tasksId: string, todolistId: string) => {
        dispatchToTasks(deleteTaskAC(tasksId, todolistId))
    }

    const addTask = (title: string, todoListId: string) => {
        dispatchToTasks(createTaskAC({
            id: "12",
            description: "dd",
            title,
            addedDate: "ad",
            startDate: "sd",
            priority: TaskPriorities.Low,
            order: 0,
            deadline: "d",
            status: TaskStatuses.New,
            todoListId
        }))
    }

    const changeTaskStatus = (taskId: string, newStatus: TaskStatuses, todolistId: string) => {
        dispatchToTasks(changeTaskStatusAC(taskId, newStatus, todolistId))
    }
    const updateTask = (todolistId: string, taskId: string, title: string) => {
        dispatchToTasks(changeTaskTitleAC(taskId, title, todolistId))
    }


    const todoListElement = todolists.map(tl => {

        let tasksForTodolist = tasks[tl.id];
        if (tl.filter === "active") {
            tasksForTodolist = tasks[tl.id].filter((t: TaskType) => t.status === TaskStatuses.New)
        }
        if (tl.filter === "completed") {
            tasksForTodolist = tasks[tl.id].filter((t: TaskType) => t.status === TaskStatuses.Completed)
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
