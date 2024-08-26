import React, {ChangeEvent, KeyboardEvent, useState} from "react";

import type {Meta, StoryObj} from "@storybook/react";
import {fn} from "@storybook/test";
import {Button} from "../Button";
import {AddItemForm, Props} from "./AddItemForm";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof AddItemForm> = {
    title: "TODOLIST/AddItemForm",
    component: AddItemForm,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        addItem: {
            description: "Button clicked inside form",
            action: "clicked"
        }
    },
    args: {
        addItem: fn()
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

export default meta;

type Story = StoryObj<typeof AddItemForm>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const AddItemFormStory: Story = {
    args: {
        addItem: fn()
        // addItem: action("Button clicked inside form")
    },
};


const AddItemFormError = React.memo(({addItem}: Props) => {
    const [taskTitle, setTaskTitle] = useState("")
    const [taskInputError, setTaskInputError] = useState<string | null>("Field is required")


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

export const AdditemFormErrorStory: Story = {
    render: (args) => <AddItemFormError addItem={args.addItem}/>
}