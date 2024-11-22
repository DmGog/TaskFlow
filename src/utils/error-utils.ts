import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "app/appSlice"
import {ResponseType} from "api/todolists-api"
import {Dispatch} from "redux"
import axios from "axios";

export const handleServerAppError = <D>(
    data: ResponseType<D>,
    dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>,
) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: "Some error occurred"}))
    }
    dispatch(setAppStatusAC({status: "failed"}))
}

export const handleServerNetworkError = (err: unknown, dispatch: Dispatch): void => {
    let errorMessage = "Some error occurred";
    if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err?.message || errorMessage;
    } else if (err instanceof Error) {
        errorMessage = `Native error: ${err.message}`;
    } else {
        errorMessage = JSON.stringify(err);
    }

    dispatch(setAppErrorAC({error: errorMessage}));
    dispatch(setAppStatusAC({status: "failed"}));
};