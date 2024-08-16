import React, {memo, useCallback, useMemo} from "react";
import {Button} from "./Button";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../redusers/store";
import {addTaskAC} from "../redusers/tasks-reducer";
import {
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    TodolistDomainType
} from "../redusers/todolists-reducer";
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "../api/todolist-api";

type TodolistPropsType = {
    todolist: TodolistDomainType
}

export const TodolistRedux = memo(({
                                       todolist,
                                   }: TodolistPropsType) => {

    const {id, title, filter} = todolist
    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id])
    const dispatch = useDispatch()

    const addTaskHandler = useCallback((title: string) => {
        dispatch(addTaskAC(title, id))
    }, [dispatch])

    tasks = useMemo(() => {
        if (filter === "active") {
            tasks = tasks.filter(t => t.status === TaskStatuses.New)
        }
        if (filter === "completed") {
            tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
        }
        return tasks
    }, [tasks, filter])


    const tasksElement: Array<JSX.Element> | JSX.Element = tasks.length !== 0 ?

        tasks.map(task => <Task key={task.id} task={task} id={id}/>) : <span>нет тасок</span>

    const updateTodolistHandler = useCallback((title: string) => {
        dispatch(changeTodolistTitleAC(id, title))
    }, [dispatch])

    return (
        <div className="todolist">
            <Button title={"X"} onClickHandler={useCallback(() => dispatch(removeTodolistAC(id)), [dispatch])}/>
            <h3><EditableSpan oldTitle={title} className={""} updateItem={updateTodolistHandler}/></h3>
            <AddItemForm addItem={addTaskHandler}/>
            <ul>
                {tasksElement}
            </ul>

            <div>
                <Button clas={filter === "all" ? "button-active" : ""}
                        onClickHandler={useCallback(() => dispatch(changeTodolistFilterAC(id, "all")), [dispatch])}
                        title={"All"}/>
                <Button clas={filter === "active" ? "button-active" : ""}
                        onClickHandler={useCallback(() => dispatch(changeTodolistFilterAC(id, "active")), [dispatch])}
                        title={"Active"}/>
                <Button clas={filter === "completed" ? "button-active" : ""}
                        onClickHandler={useCallback(() => dispatch(changeTodolistFilterAC(id, "completed")), [dispatch])}
                        title={"Completed"}/>
            </div>
        </div>

    );
});

