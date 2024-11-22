import {tasksReducer} from "features/TodolistsList/tasksSlice"
import {todolistsReducer} from "features/TodolistsList/todolistsSlice"
import {combineReducers} from "redux"
import {ThunkAction, ThunkDispatch} from "redux-thunk"
import {appReducer} from "app/appSlice"
import {authReducer} from "features/Login/authSlice"
import {configureStore, UnknownAction} from "@reduxjs/toolkit"

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
})
export const store = configureStore({reducer: rootReducer})

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, UnknownAction>
