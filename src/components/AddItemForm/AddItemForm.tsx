import React, {ChangeEvent, KeyboardEvent, useState} from "react"
import {IconButton, TextField} from "@mui/material"
import {AddBox} from "@mui/icons-material"

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(function ({addItem, disabled = false}: AddItemFormPropsType) {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addItemHandler = () => {
        if (title.trim() === "") {
            setError("Title is required")
        } else if (title.length > 100) {
            setError("Title must be 30 characters or less")
        } else {
            addItem(title)
            setTitle("")
            setError(null)
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        if (error) {
            setError(null)
        }
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        if (e.charCode === 13) {
            addItemHandler()
        }
    }

    return (
        <div>
            <TextField
                variant="outlined"
                disabled={disabled}
                error={!!error}
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                label="Title"
                helperText={error}
            />
            <IconButton color="primary" onClick={addItemHandler} disabled={disabled}>
                <AddBox/>
            </IconButton>
        </div>
    )
})
