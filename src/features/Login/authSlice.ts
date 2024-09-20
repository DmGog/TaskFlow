import {setAppStatusAC} from "app/appSlice"
import {authAPI, LoginParamsType} from "api/todolists-api"
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {AppThunk} from "app/store"
import {clearTasksAndTodolists} from "app/common/actions/common.acions";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedInAC: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        },
    },
    selectors: {
        selectIsLoggedIn: (sliceState) => sliceState.isLoggedIn
    }
})

export const authReducer = authSlice.reducer
export const {setIsLoggedInAC} = authSlice.actions

export const {selectIsLoggedIn} = authSlice.selectors

// thunks
export const loginTC =
    (data: LoginParamsType): AppThunk =>
        (dispatch) => {
            dispatch(setAppStatusAC({status: "loading"}))
            authAPI
                .login(data)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(setIsLoggedInAC({isLoggedIn: true}))
                        dispatch(setAppStatusAC({status: "succeeded"}))
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch)
                })
        }
export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    authAPI
        .logout()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({isLoggedIn: false}))
                dispatch(clearTasksAndTodolists())
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
