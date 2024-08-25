import React, {useCallback, useEffect} from "react";
import "../App.css";
import {AddItemForm} from "../components/AddItemForm";
import {createTodoThunkTC, getTodoThunkTC, TodolistDomainType} from "../redusers/todolists-reducer";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../redusers/store";
import {TodolistRedux} from "../components/TodolistRedux";


function AppWithRedux() {
    let todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
    const dispatch = useAppDispatch()
    const createTodolist = useCallback((title: string) => {
        dispatch(createTodoThunkTC(title))
    }, [dispatch])


    useEffect(() => {
        dispatch(getTodoThunkTC())
    }, [dispatch]);


    const todoListElement = todolists.map(tl => {

        return (
            <TodolistRedux
                key={tl.id}
                todolist={tl}
            />
        )
    })
    return (
        <div className="App">
            <AddItemForm addItem={createTodolist}/>
            {todoListElement}
        </div>
    );
}

export default AppWithRedux;
