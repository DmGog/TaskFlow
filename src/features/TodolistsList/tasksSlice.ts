import {addTodolistAC, removeTodolistAC, setTodolistsAC,} from "features/TodolistsList/todolistsSlice"
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "api/todolists-api"
import {Dispatch} from "redux"
import {AppRootStateType, AppThunk} from "app/store"
import {setAppStatusAC} from "app/appSlice"
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {clearTasksAndTodolists} from "app/common/actions/common.acions";

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


export const fetchTasksTC = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    const res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
    return {tasks, todolistId}
})


const tasksSlice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string; todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift(action.payload.task)
        },

        updateTaskAC(
            state,
            action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>,
        ) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        }
    },
    selectors: {
        selectTasks: (sliceState) => sliceState
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTodolistAC, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolistAC, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(setTodolistsAC, (state, action) => {
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
    },
})

export const tasksReducer = tasksSlice.reducer
export const {removeTaskAC,  addTaskAC, updateTaskAC} = tasksSlice.actions

export const {selectTasks} = tasksSlice.selectors

// thunks

export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then(() => {
        const action = removeTaskAC({taskId, todolistId})
        dispatch(action)
    })
}
export const addTaskTC =
    (title: string, todolistId: string): AppThunk =>
        (dispatch) => {
            dispatch(setAppStatusAC({status: "loading"}))
            todolistsAPI
                .createTask(todolistId, title)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        const task = res.data.data.item
                        const action = addTaskAC({task})
                        dispatch(action)
                        dispatch(setAppStatusAC({status: "succeeded"}))
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch)
                })
        }
export const updateTaskTC =
    (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
        (dispatch, getState: () => AppRootStateType) => {
            const state = getState()
            const task = state.tasks[todolistId].find((t) => t.id === taskId)
            if (!task) {
                console.warn("task not found in the state")
                return
            }

            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...domainModel,
            }

            todolistsAPI
                .updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        const action = updateTaskAC({taskId, model: domainModel, todolistId})
                        dispatch(action)
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch)
                })
        }

