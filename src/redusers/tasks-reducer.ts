import {CreateTodolistAT, DeleteTodolistAT, GetTodolistsAT} from "./todolists-reducer";
import {TaskStatuses, TaskType, todolistApi} from "../api/todolist-api";
import {Dispatch} from "redux";

export type TaskStateType = {
    [todolistId: string]: TaskType[]
}
type DeleteTaskAT = ReturnType<typeof deleteTaskAC>
type CreateTaskAT = ReturnType<typeof createTaskAC>
type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>


export type ActionType =
    DeleteTaskAT
    | CreateTaskAT
    | ChangeTaskStatusAT
    | ChangeTaskTitleAT
    | CreateTodolistAT
    | DeleteTodolistAT | GetTodolistsAT


const initialState: TaskStateType = {}

export const tasksReducer = (tasks = initialState, action: ActionType): TaskStateType => {

    switch (action.type) {
        case "GET-TODOLISTS": {
            return action.todos.reduce((acc, tl) => {
                acc[tl.id] = []
                return acc
            }, tasks)
        }
        case "REMOVE-TASK": {
            const todolistId = action.payload.todolistId
            const tasksId = action.payload.taskId
            return {...tasks, [todolistId]: tasks[todolistId].filter(tl => tl.id !== tasksId)}
        }
        case "ADD-TASK": {
            const task = action.payload.task
            return {...tasks, [task.todoListId]: [task, ...tasks[task.todoListId]]}
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
            return {...tasks, [action.payload.todo.id]: []}
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

export const deleteTaskAC = (taskId: string, todolistId: string) => ({
    type: "REMOVE-TASK",
    payload: {
        taskId,
        todolistId
    }
} as const)
export const createTaskAC = (task: TaskType) => ({
    type: "ADD-TASK",
    payload: {
        task
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

// thunk

export const createTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    todolistApi.createTask(todoId,title).then((res) => {
        dispatch(createTaskAC(res.data.data.item))
    })
}