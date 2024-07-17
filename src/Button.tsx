import React from "react";

type ButtonPropsType = {
    title: string
    onClickHandler?: () => void
    disabled?: boolean
    clas?: string
}
export const Button = ({title, onClickHandler, disabled, clas}: ButtonPropsType) => {
    return (
        <button className={clas} disabled={disabled} onClick={onClickHandler}>{title}</button>
    );
};

