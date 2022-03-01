import {assign, Interpreter, Machine} from "xstate";

export interface BaseModalMachineSchema {
    states: {
        invisible: {};
        visible: {};
    };
}

export type BaseModalMachineSchemaEvents =
    | { type: 'SHOW' }
    | { type: 'HIDE' }
    | { type: 'SHOW'; transData?: Record<string, any> };

export interface BaseModalMachineContext {
    cancelCallback: () => void;
    confirmCallback: (data: any) => void;
    transData: Record<string, any>;
}

export interface BaseModalService {
    baseModalService: Interpreter<BaseModalMachineContext,
        BaseModalMachineSchema,
        BaseModalMachineSchemaEvents>;
}

const generateBaseModalMachine = ({initial}) => {
    return Machine<BaseModalMachineContext, BaseModalMachineSchema, BaseModalMachineSchemaEvents>(
        {
            id: 'dialog',
            initial,
            context: {
                cancelCallback: () => null,
                confirmCallback: () => null,
                transData: {},
            },
            states: {
                invisible: {
                    entry: 'resetModal',
                    // entry: "transiting",
                    on: {SHOW: 'visible'},
                },
                visible: {
                    entry: ['transiting', 'setModal'],
                    on: {HIDE: 'invisible'},
                    after: {
                        // after 3 seconds, transition to invisible
                        // 3000: "invisible",
                    },
                },
            },
        },
        {
            actions: {
                transiting: assign((ctx, event: any) => {
                    return {
                        transData: event.transData,
                    };
                }),
                setModal: assign((ctx, event: any) => ({
                    content: event.content,
                    confirmCallback: event.confirmCallback,
                })),
                resetModal: assign((ctx, event: any) => ({
                    content: undefined,
                    confirmCallback: () => null,
                    transData: {}
                })),
            },
        }
    );
};

export const BaseModalMachine = Machine<BaseModalMachineContext,
    BaseModalMachineSchema,
    BaseModalMachineSchemaEvents>(
    {
        id: 'dialog',
        initial: 'invisible',
        context: {
            cancelCallback: () => null,
            confirmCallback: () => null,
            transData: {},
        },
        states: {
            invisible: {
                entry: ['resetTransData', 'resetModal'],
                on: {SHOW: 'visible'},
            },
            visible: {
                entry: ['setTransData', 'setModal'],
                on: {HIDE: 'invisible'},
                after: {},
            },
        },
    },
    {
        actions: {
            setTransData: assign((ctx, event: any) => {
                return {
                    transData: event.transData,
                };
            }),
            resetTransData: assign((ctx, event: any) => {
                return {
                    transData: {},
                };
            }),
            setModal: assign((ctx, event: any) => ({
                content: event.content,
                confirmCallback: event.confirmCallback,
            })),
            resetModal: assign((ctx, event: any) => ({
                content: undefined,
                confirmCallback: () => null,
            })),
            setSnackbar: assign((ctx, event: any) => ({
                content: event.content,
                confirmCallback: event.confirmCallback,
            })),
            resetSnackbar: assign((ctx, event: any) => ({
                severity: undefined,
                message: undefined,
                content: undefined,
                confirmCallback: () => null,
            })),
        },
    }
);

export default generateBaseModalMachine