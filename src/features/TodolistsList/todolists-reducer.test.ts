import {
    addTodolistTC,
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
    todolistsReducer,
} from "features/TodolistsList/todolistsSlice"
import {v1} from "uuid"
import {RequestStatusType} from "app/appSlice"

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType> = []

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", entityStatus: "idle", addedDate: "", order: 0},
        {id: todolistId2, title: "What to buy", filter: "all", entityStatus: "idle", addedDate: "", order: 0},
    ]
})

test("correct todolist should be removed", () => {
    type actionType = Omit<ReturnType<typeof removeTodolistTC.fulfilled>, "meta">
    const action: actionType = {
        type: removeTodolistTC.fulfilled.type,
        payload: {
            id: "todolistId2"
        }
    }
    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {


    type actionType = Omit<ReturnType<typeof addTodolistTC.fulfilled>, "meta">
    const action: actionType = {
        type: addTodolistTC.fulfilled.type,
        payload: {
            todolist: {
                id: "blabla",
                title: "new todolist",
                order: 0,
                addedDate: "",
            }
        }
    }

    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe("What to learn")
    expect(endState[0].filter).toBe("all")
})

test("correct todolist should change its name", () => {
    let newTodolistTitle = "New Todolist"
    type actionType = Omit<ReturnType<typeof changeTodolistTitleTC.fulfilled>, "meta">

    const action: actionType = {
        type: changeTodolistTitleTC.fulfilled.type,
        payload: {
            id: "todolistId2",
            title: newTodolistTitle,
        }
    }

    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe("What to learn")
    expect(endState[1].title).toBe(newTodolistTitle)
})

test("correct filter of todolist should be changed", () => {
    let newFilter: FilterValuesType = "completed"

    const action = changeTodolistFilterAC({id: todolistId2, filter: newFilter})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe("all")
    expect(endState[1].filter).toBe(newFilter)
})
test("todolists should be added", () => {
    type actionType = Omit<ReturnType<typeof fetchTodolistsTC.fulfilled>, "meta">
    const action: actionType = {
        type: fetchTodolistsTC.fulfilled.type,
        payload: {
            todolists: startState
        }
    }

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})
test("correct entity status of todolist should be changed", () => {
    let newStatus: RequestStatusType = "loading"

    const action = changeTodolistEntityStatusAC({id: todolistId2, status: newStatus})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].entityStatus).toBe("idle")
    expect(endState[1].entityStatus).toBe(newStatus)
})
