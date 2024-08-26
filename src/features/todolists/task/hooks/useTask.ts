import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {TaskStatuses} from "../../../../api/todolist-api";
import {deleteTaskTC, updateTaskTC} from "../tasks-reducer";

export const useTask = (id: string, taskId: string) => {
    const dispatch = useDispatch();

    const updateStatusTask = useCallback((isCompleted: boolean) => {
        const newStatus = isCompleted ? TaskStatuses.Completed : TaskStatuses.New;
        dispatch(updateTaskTC(id, taskId, { status: newStatus }));
    }, [dispatch, id, taskId]);

    const deleteTask = useCallback(() => {
        dispatch(deleteTaskTC(id, taskId));
    }, [dispatch, id, taskId]);

    const updateTaskTitle = useCallback((newTitle: string) => {
        dispatch(updateTaskTC(id, taskId, { title: newTitle }));
    }, [dispatch, id, taskId]);

    return { updateStatusTask, deleteTask, updateTaskTitle };
};