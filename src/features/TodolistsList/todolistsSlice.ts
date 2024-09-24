import {ResultCode, todolistsAPI, TodolistType} from "api/todolists-api"
import {RequestStatusType, setAppStatusAC} from "app/appSlice"
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils"
import {AppThunk} from "app/store"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {clearTasksAndTodolists} from "app/common/actions/common.acions";
import {createAppAsyncThunk} from "utils/createAppAsyncThunk";

const initialState: Array<TodolistDomainType> = []
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


export const fetchTodolistsTC = createAppAsyncThunk<{
    todolists: TodolistType[]
}>("todolists/fetchTodolists", async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todolistsAPI.getTodolists()
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {todolists: res.data}
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue(null)
    }
})

export const removeTodolistTC = createAppAsyncThunk<{ id: string }, {
    todolistId: string
}>("todolists/removeTodolistTC", async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    thunkAPI.dispatch(changeTodolistEntityStatusAC({id: arg.todolistId, status: "loading"}))
    try {
        const res = await todolistsAPI.deleteTodolist(arg.todolistId)
        if (res.data.resultCode !== ResultCode.success) {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {id: arg.todolistId}
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})


export const todolistsSlice = createSlice({
    name: "todolists",
    initialState: initialState,
    reducers: {
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
        }
    },
    selectors: {
        selectTodolists: (sliceState) => sliceState
    },

    extraReducers: builder => {
        builder.addCase(clearTasksAndTodolists, (state, action) => {
            return []
        })
            .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
                return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}))
            })
            .addCase(removeTodolistTC.fulfilled, (state, action) => {
                const index = state.findIndex((todo) => todo.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            })
    }
})

export const todolistsReducer = todolistsSlice.reducer
export const {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    changeTodolistEntityStatusAC,
} = todolistsSlice.actions

export const {selectTodolists} = todolistsSlice.selectors

// thunks


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

