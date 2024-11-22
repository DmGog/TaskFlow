import {addTodolistTC, TodolistDomainType, todolistsReducer} from "features/TodolistsList/todolistsSlice"
import {tasksReducer, TasksStateType} from "features/TodolistsList/tasksSlice"

test("ids should be equals", () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

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

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})
