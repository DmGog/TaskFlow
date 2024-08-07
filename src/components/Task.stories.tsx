import React from "react";

import type {Meta, StoryObj} from "@storybook/react";
import {fn} from "@storybook/test";
import {action} from "@storybook/addon-actions"
import {Task} from "./Task";
import {ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../redusers/store";
import {TaskType} from "./TodolistRedux";
import {v1} from "uuid";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Task> = {
    title: "TODOLIST/Task",
    component: Task,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    decorators: [ReduxStoreProviderDecorator],

    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

export default meta;

type Story = StoryObj<typeof Task>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

const Task1 = () => {
    let task = useSelector<AppRootStateType, TaskType>(state => state.tasks["todolistId1"][0])
    if (!task) task = {id: v1(), title: "DEFAULT", isDone: false}
    return <Task task={task} id={"todolistId1"}/>
}
export const TaskIsNotDone: Story = {
    render: () => <Task1/>
};

