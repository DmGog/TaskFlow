import {todolistApi, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & { filter: FilterValuesType }

// ActionType
export type CreateTodolistAT = ReturnType<typeof createTodolistAC>
export type DeleteTodolistAT = ReturnType<typeof deleteTodolistAC>
type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>
type UpdateTodolistTitleAT = ReturnType<typeof updateTodolistTitleAC>
export type GetTodolistsAT = ReturnType<typeof getTodolistsAC>

export type ActionsType =
    CreateTodolistAT
    | DeleteTodolistAT
    | ChangeTodolistFilterAT
    | UpdateTodolistTitleAT
    | GetTodolistsAT

const initialState: TodolistDomainType[] = []
export const todolistsReducer = (todolists = initialState, action: ActionsType): TodolistDomainType[] => {

    switch (action.type) {
        case "GET-TODOLISTS": {
            return action.todos.map(e => ({...e, filter: "all"}))
        }
        case "ADD-TODOLIST": {
            return [...todolists, {...action.payload.todo, filter: "all"}]
        }
        case "REMOVE-TODOLIST": {
            return todolists.filter(tl => tl.id !== action.payload.id)
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

// ActionCreator

export const createTodolistAC = (todo: TodolistType) => ({
    type: "ADD-TODOLIST",
    payload: {
        todo
    }
} as const)

export const deleteTodolistAC = (id: string) => ({
    type: "REMOVE-TODOLIST",
    payload: {
        id
    }
} as const)

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: "CHANGE-TODOLIST-FILTER",
    payload: {
        id, filter
    }
} as const)

export const updateTodolistTitleAC = (id: string, title: string) => ({
    type: "CHANGE-TODOLIST-TITLE",
    payload: {
        id, title
    }
} as const)

export const getTodolistsAC = (todos: TodolistType[]) => ({
    type: "GET-TODOLISTS", todos
} as const)


//-------------thunk
export const getTodoThunkTC = () => (dispatch: Dispatch) => {
    todolistApi.getTodolist().then((res) => {
        dispatch(getTodolistsAC(res.data))
    })
}

export const createTodoThunkTC = (title: string) => (dispatch: Dispatch) => {
    todolistApi.createTodolist(title).then((res) => {
        dispatch(createTodolistAC(res.data.data.item))
    })
}

export const deleteTodoThunkTC = (todoId: string) => (dispatch: Dispatch) => {
    todolistApi.deleteTodolist(todoId).then((res) => {
        dispatch(deleteTodolistAC(todoId))
    })
}

export const updateTodoTitleThunkTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    todolistApi.updateTodolist(todoId, title).then((res) => {
        dispatch(updateTodolistTitleAC(todoId, title))
    })
}