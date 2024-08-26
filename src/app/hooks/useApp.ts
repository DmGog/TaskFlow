import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../store";
import {createTodoThunkTC, getTodoThunkTC, TodolistDomainType} from "../../features/todolists/todolists-reducer";
import {useCallback, useEffect} from "react";

export const useApp = () => {
    const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getTodoThunkTC())
    }, [dispatch]);

    const createTodolist = useCallback((title: string) => {
        dispatch(createTodoThunkTC(title))
    }, [dispatch])

    return {
        todolists,
        createTodolist
    }
}