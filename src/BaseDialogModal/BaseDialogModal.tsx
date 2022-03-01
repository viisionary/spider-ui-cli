import * as React from "react";
import { CloseBtn } from "./CloseBtn";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useActor } from "@xstate/react";
import {BaseModalService} from "./baseModalMachine";

/**
 Created by IntelliJ IDEA.
 User: visionary
 Date: 2021/12/7
 Time: 10:54 AM
 */
export interface Props extends BaseModalService {
  styles?: any;
  title: string;
}


const BaseDialogModal: React.FC<Props> = ({ title, styles, baseModalService, children }) => {
  const [baseModalState, sendBaseModalState] = useActor(baseModalService);
  const handleClose = () => {
    // console.info(baseModalState.value)
    sendBaseModalState({ type: "HIDE" });
  };

  if (baseModalState.matches('invisible')){
    return null
  }
  return (
    <Dialog
      maxWidth={"md"}
      open={baseModalState.matches("visible")}
    >
      <DialogTitle>{title}
        <CloseBtn onClose={handleClose} />
      </DialogTitle>
      {children}
    </Dialog>
  );
};
export default BaseDialogModal;