import {todolistsAPI, TodolistType} from "api/todolists-api"
import {RequestStatusType, setAppStatusAC} from "app/appSlice"
import {handleServerNetworkError} from "utils/error-utils"
import {AppThunk} from "app/store"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {clearTasksAndTodolists} from "app/common/actions/common.acions";

const initialState: Array<TodolistDomainType> = []
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const todolistsSlice = createSlice({
    name: "todolists",
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.push({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string; title: string }>) {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string; status: RequestStatusType }>) {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
        setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}))
        },
    },
    selectors: {
        selectTodolists: (sliceState) => sliceState
    },

    extraReducers: builder => {
        builder.addCase(clearTasksAndTodolists, (state, action) => {
            return []
        })
    }
})

export const todolistsReducer = todolistsSlice.reducer
export const {
    removeTodolistAC,
    setTodolistsAC,
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    changeTodolistEntityStatusAC,
} = todolistsSlice.actions

export const {selectTodolists} = todolistsSlice.selectors

// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}))
        todolistsAPI
            .getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC({todolists: res.data}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(setAppStatusAC({status: "loading"}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: "loading"}))
        todolistsAPI.deleteTodolist(todolistId).then((res) => {
            dispatch(removeTodolistAC({id: todolistId}))
            //скажем глобально приложению, что асинхронная операция завершена
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}))
        todolistsAPI.createTodolist(title).then((res) => {
            dispatch(addTodolistAC({todolist: res.data.data.item}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title).then((res) => {
            dispatch(changeTodolistTitleAC({id, title}))
        })
    }
}

