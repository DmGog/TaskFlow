import {useCallback, useEffect, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../../app/store";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {createTaskTC, getTasksTC} from "../task/tasks-reducer";
import {
    changeTodolistFilterAC,
    deleteTodoThunkTC,
    FilterValuesType,
    updateTodoTitleThunkTC
} from "../todolists-reducer";

export const useTodolist = (id: string, filter: string) => {
    const dispatch = useDispatch();
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id]);

    useEffect(() => {
        dispatch(getTasksTC(id));
    }, [dispatch, id]);

    const addTask = useCallback((title: string) => {
        dispatch(createTaskTC(id, title));
    }, [dispatch, id]);

    const updateTodolistTitle = useCallback((title: string) => {
        dispatch(updateTodoTitleThunkTC(id, title));
    }, [dispatch, id]);

    const deleteTodolist = useCallback(() => {
        dispatch(deleteTodoThunkTC(id));
    }, [dispatch, id]);

    const changeFilter = useCallback((newFilter: FilterValuesType) => {
        dispatch(changeTodolistFilterAC(id, newFilter));
    }, [dispatch, id]);

    const filteredTasks = useMemo(() => {
        if (filter === "active") {
            return tasks.filter(t => t.status === TaskStatuses.New);
        }
        if (filter === "completed") {
            return tasks.filter(t => t.status === TaskStatuses.Completed);
        }
        return tasks;
    }, [tasks, filter]);

    return {
        tasks: filteredTasks,
        addTask,
        updateTodolistTitle,
        deleteTodolist,
        changeFilter
    };
};
