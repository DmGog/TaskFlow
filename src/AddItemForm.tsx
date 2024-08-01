import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button} from "./Button";

type Props = {
    addItem: (title: string) => void
}

export const AddItemForm = React.memo(({addItem}: Props) => {
    const [taskTitle, setTaskTitle] = useState("")
    const [taskInputError, setTaskInputError] = useState<string | null>(null)


    const addItemHandler = () => {
        if (taskTitle.trim() === "") {
            setTaskInputError("Field is required")
        } else {
            addItem(taskTitle.trim());
            setTaskTitle("")
        }
    }

    const changeItemTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.currentTarget.value)
        setTaskInputError(null)
    }
    //
    const keyDownAddTaskHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (taskInputError) {
            setTaskInputError(null)
        }
        if (e.key === "Enter") {
            if (taskTitle.trim() === "") {
                setTaskInputError("Field is required");
            } else {
                addItem(taskTitle);
                setTaskTitle("");
            }
        }
    }
    return (
        <div>
            <input value={taskTitle}
                   onChange={changeItemTitleHandler}
                   onKeyDown={keyDownAddTaskHandler}
                   className={taskInputError ? "taskInputError" : ""}
            />
            <Button onClickHandler={addItemHandler} title={"+"}/>
            {taskTitle.length > 15 && <div>Много символов</div>}
            {taskInputError && <div>Field is required</div>}

        </div>
    );
});

