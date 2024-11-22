import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from "features/TodolistsList/todolistsSlice"
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
import {asyncThunkCreator, buildCreateSlice} from "@reduxjs/toolkit"
import {clearTasksAndTodolists} from "app/common/actions/common.acions";
import {AppRootStateType} from "app/store";

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

const createAppSlice = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator},
});

const tasksSlice = createAppSlice({
    name: "tasks",
    initialState: initialState,
    reducers: ((creators) => {
        return {
            fetchTasksTC: creators.asyncThunk<{ todolistId: string }, {
                tasks: TaskType[],
                todolistId: string
            }>(async (arg, {dispatch, rejectWithValue}) => {
                dispatch(setAppStatusAC({status: "loading"}))
                try {
                    const res = await todolistsAPI.getTasks(arg.todolistId)
                    const tasks = res.data.items
                    dispatch(setAppStatusAC({status: "succeeded"}))
                    return {tasks, todolistId: arg.todolistId}
                } catch (err) {
                    handleServerNetworkError(err, dispatch)
                    dispatch(setAppStatusAC({status: "failed"}))
                    return rejectWithValue(null)
                }
            }, {
                fulfilled: (state, action) => {
                    state[action.payload.todolistId] = action.payload.tasks
                }
            }),
            addTaskTC: creators.asyncThunk<AddTaskArgs, { task: TaskType }>(async (arg, {
                dispatch,
                rejectWithValue
            }) => {
                dispatch(setAppStatusAC({status: "loading"}))
                try {
                    const res = await todolistsAPI.createTask(arg)
                    if (res.data.resultCode === ResultCode.success) {
                        dispatch(setAppStatusAC({status: "succeeded"}))
                        const task = res.data.data.item
                        return {task}
                    } else {
                        handleServerAppError(res.data, dispatch)
                        dispatch(setAppStatusAC({status: "failed"}))
                        return rejectWithValue(null)
                    }
                } catch (err) {
                    handleServerNetworkError(err, dispatch)
                    dispatch(setAppStatusAC({status: "failed"}))
                    return rejectWithValue(null)
                }
            }, {
                fulfilled: (state, action) => {
                    const tasks = state[action.payload.task.todoListId]
                    tasks.unshift(action.payload.task)
                }
            }),
            removeTaskTC: creators.asyncThunk<{ todolistId: string, taskId: string }, {
                todolistId: string,
                taskId: string
            }>(async (arg, {dispatch, rejectWithValue}) => {
                dispatch(setAppStatusAC({status: "loading"}))
                try {
                    const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
                    dispatch(setAppStatusAC({status: "succeeded"}))
                    return {taskId: arg.taskId, todolistId: arg.todolistId}

                } catch (err) {
                    dispatch(setAppStatusAC({status: "failed"}))
                    return rejectWithValue(null)
                }
            }, {
                fulfilled: (state, action) => {
                    const tasks = state[action.payload.todolistId]
                    const index = tasks.findIndex((task) => task.id === action.payload.taskId)
                    if (index !== -1) tasks.splice(index, 1)
                }
            }),
            updateTaskTC: creators.asyncThunk<UpdateTaskArgType, UpdateTaskArgType>(async (arg, {
                dispatch,
                rejectWithValue,
                getState
            }) => {

                const state = getState() as AppRootStateType
                const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
                if (!task) {
                    console.warn("task not found in the state")
                    return rejectWithValue(null)
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
                dispatch(setAppStatusAC({status: "loading"}))
                try {
                    const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
                    dispatch(setAppStatusAC({status: "succeeded"}))
                    if (res.data.resultCode === ResultCode.success) return {
                        taskId: arg.taskId,
                        domainModel: arg.domainModel,
                        todolistId: arg.todolistId
                    }
                    else {
                        handleServerAppError(res.data, dispatch)
                        dispatch(setAppStatusAC({status: "failed"}))
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    dispatch(setAppStatusAC({status: "failed"}))
                    return rejectWithValue(null)
                }
            }, {
                fulfilled: (state, action) => {
                    const tasks = state[action.payload.todolistId]
                    const index = tasks.findIndex((task) => task.id === action.payload.taskId)
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            }),
        }
    }),
    selectors: {
        selectTasks: (sliceState) => sliceState
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTodolistTC.fulfilled, (state, action) => {
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
    },
})


export const tasksReducer = tasksSlice.reducer
export const {fetchTasksTC, addTaskTC, removeTaskTC, updateTaskTC} = tasksSlice.actions
export const {selectTasks} = tasksSlice.selectors


