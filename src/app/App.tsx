import React from "react";
import "../App.css";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {Todolist} from "../features/todolists/Todolist";
import {useApp} from "./hooks/useApp";


function App() {
    const {todolists, createTodolist} = useApp()
    const todolistsEl = todolists.map(tl => {
        return (
            <Todolist
                key={tl.id}
                todolist={tl}
            />
        )
    })
    return (
        <div className="App">
            <AddItemForm addItem={createTodolist}/>
            {todolistsEl}
        </div>
    );
}

export default App;
