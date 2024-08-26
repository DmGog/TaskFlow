import {createTodolistAC, deleteTodolistAC} from "../todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../../../api/todolist-api";
import {createTaskAC, deleteTaskAC, tasksReducer, TaskStateType, updateTaskAC} from "./tasks-reducer";

let startState: TaskStateType

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId1"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId1"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId1"
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "bread",
                status: TaskStatuses.New,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId2"
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatuses.Completed,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId2"
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId2"
            }
        ]
    }
})

test("correct task should be deleted from correct array", () => {

    const action = deleteTaskAC("2", "todolistId2")

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId1"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId1"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId1"
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "bread",
                status: TaskStatuses.New,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId2"
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: "todolistId2"
            }
        ]
    })
})
test("correct task should be added to correct array", () => {

    const action = createTaskAC({
        title: "juce",
        todoListId: "todolistId2",
        status: TaskStatuses.New,
        order: 0,
        addedDate: "ad",
        startDate: "sd",
        deadline: "d",
        priority: TaskPriorities.Low,
        id: "12",
        description: "task"
    })

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3)
    expect(endState["todolistId2"].length).toBe(4)
    expect(endState["todolistId2"][0].id).toBeDefined()
    expect(endState["todolistId2"][0].title).toBe("juce")
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New)
})
test("status of specified task should be changed", () => {

    const action = updateTaskAC("todolistId2", "1", {
        status: TaskStatuses.New,
        title: "new",
        startDate: "sd",
        deadline: "d",
        priority: TaskPriorities.Low,
        description: "d"
    })

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"]["1"].status).toBe(TaskStatuses.New)
    expect(endState["todolistId1"]["1"].status).toBe(TaskStatuses.Completed)
})
test("title of specified task should be changed", () => {

    const action = updateTaskAC("todolistId2", "2", {
        title: "coffee",
        description: "d",
        priority: TaskPriorities.Low,
        deadline: "d",
        startDate: "sd",
        status: TaskStatuses.New
    })

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"]["1"].title).toBe("coffee")
    expect(endState["todolistId1"]["1"].title).toBe("JS")
})
test("new array should be added when new todolist is added", () => {

    const action = createTodolistAC({id: "122", order: 0, addedDate: "sss", title: "new todolist"})

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2")
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})
test("property with todolistId should be deleted", () => {

    const action = deleteTodolistAC("todolistId2")

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState["todolistId2"]).not.toBeDefined()
})



