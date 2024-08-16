import React, {Reducer, useReducer} from "react";
import "./App.css";
import {Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm";
import {
    ActionType,
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC, TodolistDomainType,
    todolistsReducer
} from "./redusers/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./redusers/tasks-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "./api/todolist-api";

function AppWithReducers() {

    let todolistId1 = v1()
    let todolistId2 = v1()


    const [todolists, dispatchToTodolists] = useReducer<Reducer<TodolistDomainType[], ActionType>>(todolistsReducer,
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
