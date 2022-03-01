import React from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {useActor} from "@xstate/react";
import {SnackbarService} from "./type";

interface Props extends SnackbarService {
}

const AlertBar: React.FC<Props> = ({snackbarService}) => {
    const [snackbarState] = useActor(snackbarService);

    return (
        <Snackbar
            open={snackbarState?.matches('visible')}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            autoHideDuration={2000}
        >
            <Alert
                data-test={`alert-bar-${snackbarState?.context.severity}`}
                elevation={6}
                severity={snackbarState?.context.severity}
            >
                {snackbarState?.context.message}
            </Alert>
        </Snackbar>
    );
};

export default AlertBar;
