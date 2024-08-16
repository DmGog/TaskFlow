import React, {useCallback} from "react";
import "./App.css";
import {AddItemForm} from "./components/AddItemForm";
import {
    addTodolistAC, TodolistDomainType
} from "./redusers/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./redusers/store";
import {TodolistRedux} from "./components/TodolistRedux";


function AppWithRedux() {
    let todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
    const dispatch = useDispatch()
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    }, [dispatch])

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
            <AddItemForm addItem={addTodolist}/>
            {todoListElement}
        </div>
    );
}

export default AppWithRedux;
