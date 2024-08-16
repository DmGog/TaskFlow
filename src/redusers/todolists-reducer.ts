import {v1} from "uuid";
import {TodolistType} from "../api/todolist-api";

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & { filter: FilterValuesType }


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

const initialState: TodolistDomainType[] = []
export const todolistsReducer = (todolists = initialState, action: ActionType): TodolistDomainType[] => {

    switch (action.type) {
        case "ADD-TODOLIST": {
            const {title, id} = action.payload
            return [...todolists, {id, filter: "all", title, order: 0, addedDate: ""}]
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

export const addTodolistAC = (title: string): AddTodolistAT => ({
    type: "ADD-TODOLIST",
    payload: {
        id: v1(),
        title
    }
})

export const removeTodolistAC = (id: string): RemoveTodolistAT => ({
    type: "REMOVE-TODOLIST",
    payload: {
        id
    }
})

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterAT => ({
    type: "CHANGE-TODOLIST-FILTER",
    payload: {
        id, filter
    }
})

export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleAT => ({
    type: "CHANGE-TODOLIST-TITLE",
    payload: {
        id, title
    }
})