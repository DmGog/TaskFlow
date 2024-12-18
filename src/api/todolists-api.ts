import axios from "axios"
import { UpdateDomainTaskModelType } from "features/TodolistsList/tasksSlice"

const settings = {
  withCredentials: true,
  headers: {
    "API-KEY": "efec5740-0aa3-4e1a-8682-caa77b0b5ed1"
  }
}
const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  ...settings
})
export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists")
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title: title })
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`)
  },
  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${id}`, { title: title })
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask(args: AddTaskArgs) {
    const { todolistId, title } = args
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, { title })
  },
  updateTask(todolistId: string,
             taskId: string,
             model: UpdateTaskModelType) {

    return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  }
}

export enum ResultCode {
  success = 0,
  error = 1,
}


export type UpdateTaskArgType = {
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistId: string
}


export type AddTaskArgs = {
  title: string,
  todolistId: string
}
export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}

export const authAPI = {
  login(data: LoginParamsType) {
    const promise = instance.post<ResponseType<{ userId?: number }>>("auth/login", data)
    return promise
  },
  logout() {
    const promise = instance.delete<ResponseType<{ userId?: number }>>("auth/login")
    return promise
  },
  me() {
    const promise = instance.get<ResponseType<{ id: number; email: string; login: string }>>("auth/me")
    return promise
  }
}


export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type ResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  data: D
}

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}
