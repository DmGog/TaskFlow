import {v1} from "uuid"
import {FilterValuesType, TodolistType} from "../App"
import {
    ActionType,
    AddTodolistAC,
    ChangeTodolistFilterAC, ChangeTodolistTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "./todolists-reducer";

test("correct todolist should be removed", () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    // 1. Стартовый state
    const startState: TodolistType[] = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"},
    ]

    // 2. Действие
    // const action: ActionType = {
    //     type: "REMOVE-TODOLIST",
    //     payload: {
    //         id: todolistId1,
    //     },
    // }
    const endState = todolistsReducer(startState, RemoveTodolistAC(todolistId1))

    // 3. Проверяем, что наши действия (изменения state) соответствуют ожиданию
    // в массиве останется один тудулист
    expect(endState.length).toBe(1)
    // удалится нужный тудулист, а не любой
    expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    const startState: TodolistType[] = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"},
    ]
    const newTodolistTitle = "New Todolist"
    // const action = AddTodolistAC(v1(), "New Todolist")
    const endState = todolistsReducer(startState, AddTodolistAC(v1(), newTodolistTitle))

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe(newTodolistTitle)
})

test("correct todolist should change its name", () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    const startState: TodolistType[] = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"},
    ]

    // const action = {
    //     type: "CHANGE-TODOLIST-TITLE" as const,
    //     payload: {
    //         id: todolistId2,
    //         title: "New Todolist",
    //     },
    // }
    const endState = todolistsReducer(startState, ChangeTodolistTitleAC(todolistId2, "New Todolist"))

    expect(endState[0].title).toBe("What to learn")
    expect(endState[1].title).toBe("New Todolist")
})

test("correct filter of todolist should be changed", () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    const startState: TodolistType[] = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"},
    ]

    // const action: ActionType = {
    //     type: "CHANGE-TODOLIST-FILTER",
    //     payload: {
    //         id: todolistId2,
    //         filter: "completed"
    //     },
    // }
    const endState = todolistsReducer(startState, ChangeTodolistFilterAC(todolistId2, "completed"))
    expect(endState[0].filter).toBe("all")
    expect(endState[1].filter).toBe("completed")
})