import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import {isString} from "lodash";
import {Typography} from "@mui/material";
import {useActor} from "@xstate/react";
import {Interpreter} from "xstate";
import {CloseBtn} from "../BaseDialogModal/CloseBtn";
import {Error} from "@mui/icons-material";

export interface DialogSchema {
    states: {
        invisible: Record<string, never>;
        visible: Record<string, never>;
    };
}

export type DialogEvents =
    | { type: "HIDE" }
    | { type: "SHOW"; confirmCallback: () => void; content: string };

export interface DialogContext {
    content: string | { type: "info" | "warning" | "error", text: string };
    cancelCallback?: () => void;
    confirmCallback?: () => void;
}

export interface DialogService {
    dialogService: Interpreter<DialogContext, DialogSchema, DialogEvents>;
}

type Props = DialogService;

export const AlertDialog: React.FC<Props> = ({dialogService}) => {
    const [dialogState, sendDialogState] = useActor(dialogService);
    const handleClose = () => {
        sendDialogState("HIDE");
    };
    const handleConfirm = () => {
        dialogState.context.confirmCallback && dialogState.context.confirmCallback();
        sendDialogState("HIDE");
    };

    return (
        <Dialog
            open={dialogState?.matches("visible")}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={handleClose}
            maxWidth={"lg"}

        >
            <DialogTitle id="alert-dialog-title">提示
                <CloseBtn onClose={handleClose}/>
            </DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingX: 17,
                    minWidth: 400,
                    marginTop: 10
                }}>
                {!isString(dialogState.context?.content) && typeof dialogState.context?.content !== "string" ? dialogState.context?.content?.type === "warning" : '' &&
                    <Error/>}
                <Typography sx={{marginY: 5, textAlign: "center"}}>
                    {isString(dialogState.context?.content) ? dialogState.context?.content : typeof dialogState.context?.content !== "string" ? dialogState.context?.content?.text : ''}
                </Typography>
            </DialogContent>
            <DialogActions sx={{}}>
                <Button onClick={handleClose} variant="outlined">
                    取消
                </Button>
                <Button onClick={handleConfirm} color="primary" autoFocus variant="contained">
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AlertDialog;
