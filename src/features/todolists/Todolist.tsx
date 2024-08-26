import React, { memo } from "react";
import { Button } from "../../components/Button";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { EditableSpan } from "../../components/EditableSpan/EditableSpan";
import { Task } from "./task/Task";
import { TodolistDomainType } from "./todolists-reducer";
import {useTodolist} from "./hooks/useTodolist";

type TodolistPropsType = {
    todolist: TodolistDomainType;
};

export const Todolist = memo(({ todolist }: TodolistPropsType) => {
    const { id, title, filter } = todolist;

    const {
        tasks,
        addTask,
        updateTodolistTitle,
        deleteTodolist,
        changeFilter
    } = useTodolist(id, filter);

    const tasksElement = tasks.length !== 0
        ? tasks.map(task => <Task key={task.id} task={task} id={id} />)
        : <span>нет тасок</span>;

    return (
        <div className="todolist">
            <Button title={"X"} onClickHandler={deleteTodolist} />
            <h3>
                <EditableSpan oldTitle={title} className={""} updateItem={updateTodolistTitle} />
            </h3>
            <AddItemForm addItem={addTask} />
            <ul>
                {tasksElement}
            </ul>
            <div>
                <Button
                    clas={filter === "all" ? "button-active" : ""}
                    onClickHandler={() => changeFilter("all")}
                    title={"All"}
                />
                <Button
                    clas={filter === "active" ? "button-active" : ""}
                    onClickHandler={() => changeFilter("active")}
                    title={"Active"}
                />
                <Button
                    clas={filter === "completed" ? "button-active" : ""}
                    onClickHandler={() => changeFilter("completed")}
                    title={"Completed"}
                />
            </div>
        </div>
    );
});
