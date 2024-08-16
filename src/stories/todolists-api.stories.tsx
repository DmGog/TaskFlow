import React, {useEffect, useState} from "react"
import {TaskPriorities, TaskStatuses, todolistApi} from "../api/todolist-api";

export default {
    title: "API",
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistApi.getTodolist()
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistApi.createTodolist("TODO")
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoId = "d4510943-aa1d-464c-80eb-b76ac7e7ca49"
        todolistApi.deleteTodolist(todoId)
            .then(res => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const todoId = "2f379b0d-e336-4dc4-aa55-47a477505f33"
    useEffect(() => {
        todolistApi.updateTodolist(todoId, "YoYoYo")
            .then(res => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

//----------------------tasks-------------

export const GetTasksTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoId = "2f379b0d-e336-4dc4-aa55-47a477505f33"
        todolistApi.getTasks(todoId)
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTaskTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoId = "2f379b0d-e336-4dc4-aa55-47a477505f33"
        const title = "ZAKREPLENO"
        todolistApi.createTask(todoId, title)
            .then((res) => {
                setState(res.data.data.item.title)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTaskTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoId = "2f379b0d-e336-4dc4-aa55-47a477505f33"
        const taskId = "9c89d80d-b523-4bbf-a092-f358d01b81f0"
        todolistApi.deleteTask(todoId, taskId)
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTaskTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoId = "2f379b0d-e336-4dc4-aa55-47a477505f33"
        const taskId = "72a34b62-461b-4419-a203-2a2c0123f1d9"
        const title = "YOYOYOYOYOYO"
        todolistApi.updateTask(todoId, taskId, {
            title,
            deadline: "",
            description: "",
            priority: TaskPriorities.Later,
            startDate: "",
            status: TaskStatuses.New
        })
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}