import {assign, Machine} from "xstate";
import {SnackbarContext, SnackbarEvents, SnackbarSchema} from "./type";

const snackbarMachine = Machine<SnackbarContext, SnackbarSchema, SnackbarEvents>(
    {
        id: 'snackbar',
        initial: 'invisible',
        context: {
            severity: undefined,
            message: undefined,
        },
        states: {
            invisible: {
                entry: 'resetSnackbar',
                on: {SHOW: 'visible'},
            },
            visible: {
                entry: 'setSnackbar',
                on: {HIDE: 'invisible'},
                after: {
                    // after 3 seconds, transition to invisible
                    3000: 'invisible',
                },
            },
        },
    },
    {
        actions: {
            setSnackbar: assign((ctx, event) => ({
                severity: event.severity,
                message: event.message,
            })),
            resetSnackbar: () => ({
                severity: undefined,
                message: undefined,
            }),
        },
    }
)

export default snackbarMachine;