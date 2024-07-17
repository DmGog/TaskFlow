import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button} from "./Button";

type Props = {
    addItem: (title: string) => void
}

export const AddItemForm = ({addItem}: Props) => {
    const [taskTitle, SetTaskTitle] = useState("")
    const [taskInputError, setTaskInputError] = useState<string | null>("нет задачи")


    const addItemHandler = () => {
        const trimmedTitle = taskTitle.trim()
        if (trimmedTitle) {
            addItem(taskTitle)
        } else {
            setTaskInputError("Title is requied")
        }

        SetTaskTitle("")
    }

    const changeItemTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        // tasksElement && setTaskInputError(null)
        SetTaskTitle(e.currentTarget.value)
    }

    const keyDownAddTaskHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addItemHandler()
        }
    }

    return (
        <div>
            <input value={taskTitle}
                   onChange={changeItemTitleHandler}
                   onKeyDown={keyDownAddTaskHandler}
                   className={taskInputError ? "taskInputError" : ""}
            />
            <Button onClickHandler={addItemHandler} title={"+"} disabled={!Boolean(taskTitle.trim())}/>
            {taskTitle.length > 15 && <div>Много символов</div>}

        </div>
    );
};

