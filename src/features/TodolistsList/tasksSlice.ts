import {addTodolistAC, fetchTodolistsTC, removeTodolistTC} from "features/TodolistsList/todolistsSlice"
import {
    AddTaskArgs,
    ResultCode,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskArgType,
    UpdateTaskModelType
} from "api/todolists-api"
import {setAppStatusAC} from "app/appSlice"
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils"
import {createSlice} from "@reduxjs/toolkit"
import {clearTasksAndTodolists} from "app/common/actions/common.acions";
import {createAppAsyncThunk} from "utils/createAppAsyncThunk";

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

const initialState: TasksStateType = {}

export const fetchTasksTC = createAppAsyncThunk<{
    tasks: TaskType[],
    todolistId: string
}, string>("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {tasks, todolistId}
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue(null)
    }
})

export const addTaskTC = createAppAsyncThunk<{
    task: TaskType
}, AddTaskArgs>("tasks/addTask", async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todolistsAPI.createTask(arg)
        if (res.data.resultCode === ResultCode.success) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            const task = res.data.data.item
            return {task}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
            return thunkAPI.rejectWithValue(null)
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue(null)
    }

})

export const removeTaskTC = createAppAsyncThunk<{ todolistId: string, taskId: string }, {
    todolistId: string,
    taskId: string
}>("tasks/removeTask", async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {taskId: arg.taskId, todolistId: arg.todolistId}

    } catch (err) {
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue(null)
    }
})

export const updateTaskTC = createAppAsyncThunk<
    UpdateTaskArgType, UpdateTaskArgType>("tasks/updateTask", async (arg, thunkAPI) => {

    const state = thunkAPI.getState()
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
    if (!task) {
        console.warn("task not found in the state")
        return thunkAPI.rejectWithValue(null)
    }
    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel,
    }
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        if (res.data.resultCode === ResultCode.success) return {
            taskId: arg.taskId,
            domainModel: arg.domainModel,
            todolistId: arg.todolistId
        }
        else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
            return thunkAPI.rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue(null)
    }
})

const tasksSlice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {},
    selectors: {
        selectTasks: (sliceState) => sliceState
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTodolistAC, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolistTC.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
                action.payload.todolists.reduce((acc, tl) => {
                    acc[tl.id] = []
                    return acc
                }, state)
            }).addCase(clearTasksAndTodolists, () => {
            return {}
        })
            .addCase(fetchTasksTC.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })
            .addCase(removeTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((task) => task.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(updateTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((task) => task.id === action.payload.taskId)
                tasks[index] = {...tasks[index], ...action.payload.domainModel}
            })
    },
})


export const tasksReducer = tasksSlice.reducer
export const {selectTasks} = tasksSlice.selectors


