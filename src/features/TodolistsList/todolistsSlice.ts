import {ResultCode, todolistsAPI, TodolistType} from "api/todolists-api"
import {RequestStatusType, setAppStatusAC} from "app/appSlice"
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils"
import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit"

const initialState: Array<TodolistDomainType> = []
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const createAppSlice = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator},
});

export const todolistsSlice = createAppSlice({
    name: "todolists",
    initialState: initialState,
    reducers: ((creators) => {
        return {
            changeTodolistFilterAC: creators.reducer((state, action: PayloadAction<{
                id: string;
                filter: FilterValuesType
            }>) => {
                const index = state.findIndex((todo) => todo.id === action.payload.id)
                state[index].filter = action.payload.filter
            }),
            changeTodolistEntityStatusAC: creators.reducer((state, action: PayloadAction<{
                id: string;
                status: RequestStatusType
            }>) => {
                const index = state.findIndex((todo) => todo.id === action.payload.id)
                state[index].entityStatus = action.payload.status
            }),
            clearTasksAndTodolists:creators.reducer(()=>{return []}),
            fetchTodolistsTC: creators.asyncThunk<undefined, { todolists: TodolistType[] }>(async (_, {
                dispatch, rejectWithValue
            }) => {
                dispatch(setAppStatusAC({status: "loading"}))
                try {
                    const res = await todolistsAPI.getTodolists()
                    dispatch(setAppStatusAC({status: "succeeded"}))
                    return {todolists: res.data}
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    dispatch(setAppStatusAC({status: "failed"}))
                    return rejectWithValue(null)
                }
            }, {
                fulfilled: (state, action) => {
                    return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}))
                }
            }),
            removeTodolistTC: creators.asyncThunk<{ todolistId: string }, { id: string }>(async (arg, {
                dispatch,
                rejectWithValue
            }) => {
                dispatch(setAppStatusAC({status: "loading"}))
                dispatch(changeTodolistEntityStatusAC({id: arg.todolistId, status: "loading"}))
                try {
                    const res = await todolistsAPI.deleteTodolist(arg.todolistId)
                    if (res.data.resultCode !== ResultCode.success) {
                        handleServerAppError(res.data, dispatch)
                        dispatch(setAppStatusAC({status: "failed"}))
                        return rejectWithValue(null)
                    }
                    dispatch(setAppStatusAC({status: "succeeded"}))
                    return {id: arg.todolistId}
                } catch (err) {
                    handleServerNetworkError(err, dispatch)
                    dispatch(setAppStatusAC({status: "failed"}))
                    return rejectWithValue(null)
                }
            }, {
                fulfilled: (state, action) => {
                    const index = state.findIndex((todo) => todo.id === action.payload.id)
                    if (index !== -1) state.splice(index, 1)
                }
            }),
            addTodolistTC: creators.asyncThunk<{ title: string }, { todolist: TodolistType }>(async (arg, {
                dispatch,
                rejectWithValue
            }) => {
                dispatch(setAppStatusAC({status: "loading"}))
                try {
                    const res = await todolistsAPI.createTodolist(arg.title)
                    dispatch(setAppStatusAC({status: "succeeded"}))
                    return {todolist: res.data.data.item}
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    dispatch(setAppStatusAC({status: "failed"}))
                    return rejectWithValue(null)
                }

            }, {
                fulfilled: (state, action) => {
                    state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
                }
            }),
            changeTodolistTitleTC: creators.asyncThunk<{ id: string, title: string }, {
                id: string,
                title: string
            }>(async (arg, {dispatch, rejectWithValue}) => {

                dispatch(setAppStatusAC({status: "loading"}))
                try {
                    const res = await todolistsAPI.updateTodolist(arg.id, arg.title)
                    dispatch(setAppStatusAC({status: "succeeded"}))
                    return {id: arg.id, title: arg.title}
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    dispatch(setAppStatusAC({status: "failed"}))
                    return rejectWithValue(null)
                }
            }, {
                fulfilled: (state, action) => {
                    const index = state.findIndex((todo) => todo.id === action.payload.id)
                    state[index].title = action.payload.title
                }
            })

        }
    }),
    selectors: {
        selectTodolists: (sliceState) => sliceState
    }
})


export const todolistsReducer = todolistsSlice.reducer
export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
    fetchTodolistsTC, removeTodolistTC, addTodolistTC, changeTodolistTitleTC
} = todolistsSlice.actions

export const {selectTodolists} = todolistsSlice.selectors



