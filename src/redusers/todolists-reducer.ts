import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";


export type AddTodolistAT = {
    type: "ADD-TODOLIST"
    payload: {
        title: string
        id: string
    }
}
export type RemoveTodolistAT = {
    type: "REMOVE-TODOLIST"
    payload: {
        id: string
    }
}
type ChangeTodolistFilterAT = {
    type: "CHANGE-TODOLIST-FILTER"
    payload: {
        filter: FilterValuesType
        id: string
    }
}
type ChangeTodolistTitleAT = {
    type: "CHANGE-TODOLIST-TITLE"
    payload: {
        title: string
        id: string
    }
}

export type ActionType = AddTodolistAT | RemoveTodolistAT | ChangeTodolistFilterAT | ChangeTodolistTitleAT
export const todolistsReducer = (todolists: TodolistType[], action: ActionType): TodolistType[] => {

    switch (action.type) {
        case "ADD-TODOLIST": {
            const {title, id} = action.payload
            return [...todolists, {id, filter: "all", title}]
        }
        case "REMOVE-TODOLIST": {
            const {id} = action.payload
            return todolists.filter(tl => tl.id !== id)
        }
        case "CHANGE-TODOLIST-FILTER": {
            const {id, filter} = action.payload
            return todolists.map(tl => tl.id === id ? {...tl, filter} : tl)
        }
        case "CHANGE-TODOLIST-TITLE": {
            const {id, title} = action.payload
            return todolists.map(tl => tl.id === id ? {...tl, title} : tl)
        }

        default:
            return todolists
    }
}

export const AddTodolistAC = (title: string): AddTodolistAT => ({
    type: "ADD-TODOLIST",
    payload: {
        id: v1(),
        title
    }
})

export const RemoveTodolistAC = (id: string): RemoveTodolistAT => ({
    type: "REMOVE-TODOLIST",
    payload: {
        id
    }
})

export const ChangeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterAT => ({
    type: "CHANGE-TODOLIST-FILTER",
    payload: {
        id, filter
    }
})

export const ChangeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleAT => ({
    type: "CHANGE-TODOLIST-TITLE",
    payload: {
        id, title
    }
})