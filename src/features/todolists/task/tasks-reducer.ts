import {CreateTodolistAT, DeleteTodolistAT, GetTodolistsAT} from "../todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistApi, UpdateTaskModelType} from "../../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../../app/store";

export type TaskStateType = {
    [todolistId: string]: TaskType[]
}
type DeleteTaskAT = ReturnType<typeof deleteTaskAC>
type CreateTaskAT = ReturnType<typeof createTaskAC>
type GetTasksAT = ReturnType<typeof getTaskAC>
type UpdateTaskAT = ReturnType<typeof updateTaskAC>
type UpdateTaskDomainModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}


export type ActionType =
    DeleteTaskAT
    | CreateTaskAT
    | CreateTodolistAT
    | DeleteTodolistAT | GetTodolistsAT | GetTasksAT | UpdateTaskAT


const initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: ActionType): TaskStateType => {

    switch (action.type) {
        case "GET-TODOLISTS": {
            return action.todos.reduce((acc, tl) => {
                acc[tl.id] = []
                return acc
            }, state)
        }
        case "GET-TASKS": {
            return {...state, [action.payload.todoId]: action.payload.tasks}
        }
        case "ADD-TASK": {
            const task = action.payload.task
            return {...state, [task.todoListId]: [task, ...state[task.todoListId]]}
        }
        case "REMOVE-TASK": {
            const todolistId = action.payload.todolistId
            const tasksId = action.payload.taskId
            return {...state, [todolistId]: state[todolistId].filter(tl => tl.id !== tasksId)}
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.payload.todoId]: state[action.payload.todoId].map(e => e.id === action.payload.taskId ? {...e, ...action.payload.model} : e)
            }
        }
        case "ADD-TODOLIST": {
            return {...state, [action.payload.todo.id]: []}
        }
        case "REMOVE-TODOLIST": {
            const {[action.payload.id]: [], ...rest} = state
            return rest
        }
        default:
            return state
    }
}


//Action Creator

export const getTaskAC = (todoId: string, tasks: TaskType[]) => ({
    type: "GET-TASKS",
    payload: {
        todoId,
        tasks
    }
} as const)
export const createTaskAC = (task: TaskType) => ({
    type: "ADD-TASK",
    payload: {
        task
    }
} as const)
export const deleteTaskAC = (taskId: string, todolistId: string) => ({
    type: "REMOVE-TASK",
    payload: {
        taskId,
        todolistId
    }
} as const)

export const updateTaskAC = (todoId: string, taskId: string, model: UpdateTaskDomainModelType) => ({
    type: "UPDATE-TASK",
    payload: {
        todoId,
        taskId,
        model
    }
} as const)


// thunk

export const getTasksTC = (todoId: string) => (dispatch: Dispatch) => {
    todolistApi.getTasks(todoId).then((res) => {
        dispatch(getTaskAC(todoId, res.data.items))
    })
}
export const createTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    todolistApi.createTask(todoId, title).then((res) => {
        dispatch(createTaskAC(res.data.data.item))
    })
}
export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistApi.deleteTask(todoId, taskId).then((res) => {
        dispatch(deleteTaskAC(taskId, todoId))
    })
}


export const updateTaskTC = (todoId: string, taskId: string, modelDomain: UpdateTaskDomainModelType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todoId].find(e => e.id === taskId)
    if (!task) {
        console.warn("task undefined")
        return
    }
    const modelApi: UpdateTaskModelType = {
        title: task.title,
        deadline: task.deadline,
        status: task.status,
        description: task.description,
        startDate: task.startDate,
        priority: task.priority,
        ...modelDomain
    }
    todolistApi.updateTask(todoId, taskId, modelApi).then((res) => {
        dispatch(updateTaskAC(todoId, taskId, modelApi))
    })
}