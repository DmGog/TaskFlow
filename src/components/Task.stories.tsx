import React from "react";

import type {Meta, StoryObj} from "@storybook/react";
import {Task} from "./Task";
import {ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../redusers/store";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/todolist-api";

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
    if (!task) task = {
        id: v1(), title: "DEFAULT", status: TaskStatuses.New,
        order: 0,
        addedDate: "",
        startDate: "",
        priority: TaskPriorities.Later,
        deadline: "",
        description: "",
        todoListId: "todolistId1"
    }
    return <Task task={task} id={"todolistId1"}/>
}
export const TaskIsNotDone: Story = {
    render: () => <Task1/>
};

