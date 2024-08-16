import React, {useState} from "react";
import "./App.css";
import {Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm";
import {FilterValuesType, TodolistDomainType} from "./redusers/todolists-reducer";
import {TaskStateType} from "./redusers/tasks-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "./api/todolist-api";

function App() {

    let todolistId1 = v1()
    let todolistId2 = v1()

    const [todolists, setTodolists] = useState<TodolistDomainType[]>(
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

    const [tasks, setTasks] = useState<TaskStateType>(
        {
            [todolistId1]: [
                {
                    id: v1(),
                    title: "css",
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
                    id: v1(),
                    title: "react",
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
        const newTitle = todolists.map(el => el.id === todolistId ? {...el, title} : el)
        setTodolists(newTitle)
    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(t => t.id !== todolistId))
        const copyTasks = {...tasks}
        delete copyTasks[todolistId]
        setTasks(copyTasks)
    }

    const addTodolist = (title: string) => {
        const newId = v1()
        const newTodo: TodolistDomainType = {
            id: newId,
            title,
            filter: "all",
            addedDate: "",
            order: 0
        }
        setTodolists([...todolists, newTodo])
        setTasks({...tasks, [newId]: []})
    }

    const changeFilter = (newFilter: FilterValuesType, todolistId: string) => {
        setTodolists(todolists.map(tl => tl.id == todolistId ? {...tl, filter: newFilter} : tl))
    }


    // tasks
    const removeTask = (tasksId: string, todolistId: string) => {

        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(tl => tl.id !== tasksId)})
    }

    const addTask = (title: string, todolistId: string) => {
        const newTask: TaskType = {
            id: v1(), title: title, status: TaskStatuses.New,
            order: 0,
            addedDate: "",
            startDate: "",
            priority: TaskPriorities.Later,
            deadline: "",
            description: "",
            todoListId: todolistId2
        }
        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})
    }

    const changeTaskStatus = (taskId: string, newIsDone: TaskStatuses, todolistId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, status: newIsDone} : t)})
    }
    const updateTask = (todolistId: string, taskId: string, title: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(el => el.id === taskId ? {...el, title} : el)})
    }


    const todoListElement = todolists.map(tl => {

        let tasksForTodolist = tasks[tl.id];
        if (tl.filter === "active") {
            tasksForTodolist = tasks[tl.id].filter(t => t.status === TaskStatuses.New)
        }
        if (tl.filter === "completed") {
            tasksForTodolist = tasks[tl.id].filter(t => t.status === TaskStatuses.Completed)
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

export default App;
