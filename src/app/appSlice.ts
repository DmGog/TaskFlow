import {Dispatch} from "redux"
import {authAPI} from "api/todolists-api"
import {setIsLoggedInAC} from "features/Login/authSlice"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"

const initialState: InitialStateType = {
    status: "idle",
    error: null,
    isInitialized: false,
}
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

const appSlice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        },
    },
    selectors: {
        selectAppError: (sliceState) => sliceState.error,
        selectAppStatus: (sliceState) => sliceState.status,
        selectIsInitialized: (sliceState) => sliceState.isInitialized,
    }
})

export const appReducer = appSlice.reducer
export const {setAppStatusAC, setAppErrorAC, setAppInitializedAC} = appSlice.actions
export const {selectAppError, selectIsInitialized, selectAppStatus} = appSlice.selectors

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
        } else {
        }

        dispatch(setAppInitializedAC({isInitialized: true}))
    })
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>

