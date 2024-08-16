import {AddTodolistAT, RemoveTodolistAT} from "./todolists-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/todolist-api";

export type TaskStateType = {
    [todolistId: string]: TaskType[]
}
type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type AddTaskAT = ReturnType<typeof addTaskAC>
type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>


export type ActionType =
    RemoveTaskAT
    | AddTaskAT
    | ChangeTaskStatusAT
    | ChangeTaskTitleAT
    | AddTodolistAT
    | RemoveTodolistAT


const initialState: TaskStateType = {}

export const tasksReducer = (tasks = initialState, action: ActionType): TaskStateType => {

    switch (action.type) {
        case "REMOVE-TASK": {
            const todolistId = action.payload.todolistId
            const tasksId = action.payload.taskId
            return {...tasks, [todolistId]: tasks[todolistId].filter(tl => tl.id !== tasksId)}
        }
        case "ADD-TASK": {
            const todolistId = action.payload.todolistId
            const newTask: TaskType = {
                id: v1(), title: action.payload.title, status: TaskStatuses.New,
                order: 0,
                addedDate: "",
                startDate: "",
                priority: TaskPriorities.Later,
                deadline: "",
                description: "",
                todoListId: action.payload.todolistId
            }
            return {...tasks, [todolistId]: [newTask, ...tasks[todolistId]]}
        }
        case "CHANGE-TASK-STATUS": {
            const todolistId = action.payload.todolistId
            const tasksId = action.payload.taskId
            const status = action.payload.status
            return {...tasks, [todolistId]: tasks[todolistId].map(e => e.id === tasksId ? {...e, status} : e)}
        }
        case "CHANGE-TASK-TITLE": {
            const todolistId = action.payload.todolistId
            const tasksId = action.payload.taskId
            const title = action.payload.title
            return {...tasks, [todolistId]: tasks[todolistId].map(e => e.id === tasksId ? {...e, title} : e)}
        }
        case "ADD-TODOLIST": {
            return {...tasks, [action.payload.id]: []}
        }
        case "REMOVE-TODOLIST": {
            // const tasksCopy = {...tasks}
            // delete tasksCopy[action.payload.id]
            // return tasksCopy
            const {[action.payload.id]: [], ...rest} = tasks
            return rest
        }


        default:
            return tasks
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => ({
    type: "REMOVE-TASK",
    payload: {
        taskId,
        todolistId
    }
} as const)
export const addTaskAC = (title: string, todolistId: string) => ({
    type: "ADD-TASK",
    payload: {
        title,
        todolistId
    }
} as const)
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => ({
    type: "CHANGE-TASK-STATUS",
    payload: {
        taskId,
        status,
        todolistId
    }
} as const)
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => ({
    type: "CHANGE-TASK-TITLE",
    payload: {
        taskId,
        title,
        todolistId
    }
} as const)
