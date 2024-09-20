import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "app/appSlice"
import {ResponseType} from "api/todolists-api"
import {Dispatch} from "redux"
import {AppDispatch} from "app/store";
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

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch):void => {
  let errorMessage = "Some error occurred";

  // ❗Проверка на наличие axios ошибки
  if (axios.isAxiosError(err)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
    // ❗ Проверка на наличие нативной ошибки
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(err);
  }

  dispatch(setAppErrorAC({ error: errorMessage }));
  dispatch(setAppStatusAC({ status: "failed" }));
};