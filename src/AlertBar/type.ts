import {Interpreter} from "xstate";

export interface SnackbarSchema {
    states: {
        invisible: Record<string, unknown>
        visible: Record<string, unknown>
    }
}

export type Severity = 'success' | 'info' | 'warning' | 'error'

export interface SnackbarContext {
    severity?: Severity
    message?: string
}

export type SnackbarEvents =
    | { type: 'SHOW'; severity?: Severity; message?: string }
    | { type: 'HIDE'; severity?: undefined; message?: undefined }

export interface SnackbarService {
    snackbarService: Interpreter<SnackbarContext, SnackbarSchema, SnackbarEvents>
}
