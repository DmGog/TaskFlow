import {TaskStateType} from "../App";
import {TaskType} from "../Todolist";
import {AddTodolistAT, RemoveTodolistAT} from "./todolists-reducer";


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
export const tasksReducer = (tasks: TaskStateType, action: ActionType): TaskStateType => {

    switch (action.type) {
        case "REMOVE-TASK": {
            const todolistId = action.payload.todolistId
            const tasksId = action.payload.taskId
            return {...tasks, [todolistId]: tasks[todolistId].filter(tl => tl.id !== tasksId)}
        }
        case "ADD-TASK": {
            const todolistId = action.payload.todolistId
            const newTask: TaskType = {id: action.payload.todolistId, title: action.payload.title, isDone: false}
            return {...tasks, [todolistId]: [newTask, ...tasks[todolistId]]}
        }
        case "CHANGE-TASK-STATUS": {
            const todolistId = action.payload.todolistId
            const tasksId = action.payload.taskId
            const isDone = action.payload.isDone
            return {...tasks, [todolistId]: tasks[todolistId].map(e => e.id === tasksId ? {...e, isDone} : e)}
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
            const stateCopy = {...tasks}
            delete stateCopy[action.payload.id]
            return stateCopy
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
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => ({
    type: "CHANGE-TASK-STATUS",
    payload: {
        taskId,
        isDone,
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
