import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export const CloseBtn = ({onClose}: { onClose: () => void }) => {
    return <IconButton
        aria-label="close"
        onClick={onClose}
        size={"small"}
        sx={{
            position: "absolute",
            right: 8,
            top: 4,
        }}
    >
        <CloseIcon fontSize={"small"} color={"disabled"}/>
    </IconButton>
}