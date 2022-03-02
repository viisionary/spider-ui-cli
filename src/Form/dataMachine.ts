import { omit } from "lodash";
import { actions, assign, createMachine } from "xstate";

export interface DataSchema {
  states: {
    idle: Record<string, unknown>;
    loading: Record<string, unknown>;
    updating: Record<string, unknown>;
    creating: Record<string, unknown>;
    deleting: Record<string, unknown>;
    success: {
      states: {
        unknown: Record<string, unknown>;
        withData: Record<string, unknown>;
        withoutData: Record<string, unknown>;
      };
    };
    failure: Record<string, unknown>;
  };
}

type SuccessEvent = { type: 'SUCCESS'; results: unknown[]; pageData: Record<string, unknown> };
type FailureEvent = { type: 'FAILURE'; message: string; results: null };
export type DataEvents =
  | { type: 'FETCH' }
  | { type: 'UPDATE' }
  | { type: 'CREATE' }
  | { type: 'DELETE' }
  | SuccessEvent
  | FailureEvent;

export interface DataContext<Results, PageData = { page: number; limit: number; total: number }> {
  pageData?: PageData;
  results?: Results[];
  message?: string;
}
const { log } = actions;

// 定义了返回的话 useMachine会报类型错误
export function dataMachine<Results, PageData>(machineId: string) {
  return createMachine<DataContext<Results, PageData>, DataEvents>(
    {
      id: machineId,
      initial: 'idle',
      context: {
        // pageData: { limit: 6, pageTotal: 1, page: 1 },
        // results: [],
        // message: undefined,
      },
      states: {
        idle: {
          on: {
            FETCH: {
              target: 'loading',
              actions: log(
                (context, event) => `event: ${event.type} context: ${JSON.stringify(context)}`,
                `DataMachine idle fetch ${machineId}:`
              ),
            },
            CREATE: 'creating',
            UPDATE: 'updating',
            DELETE: 'deleting',
          },
        },
        loading: {
          invoke: {
            src: 'fetchData',
            onDone: { target: 'success' },
            onError: { target: 'failure', actions: 'setMessage' },
          },
        },
        updating: {
          invoke: {
            src: 'updateData',
            onDone: { target: 'loading' },
            onError: { target: 'idle', actions: 'setMessage' },
          },
          on: {
            FETCH: {
              target: 'loading',
              actions: log(
                (context, event) => `count: ${context}, event: ${event.type}`,
                'updating label'
              ),
            },
          },
        },
        creating: {
          invoke: {
            src: 'createData',
            onDone: { target: 'loading' },
            onError: { target: 'idle', actions: 'setMessage' },
          },
          on: {
            FETCH: {
              target: 'loading',
              actions: log(
                (context, event) => `count: ${context}, event: ${event.type}`,
                'creating label'
              ),
            },
          },
        },
        deleting: {
          invoke: {
            src: 'deleteData',
            onDone: { target: 'loading' },
            onError: { target: 'failure', actions: 'setMessage' },
          },
          on: {
            FETCH: {
              target: 'loading',
              actions: log(
                (context, event) => `count: ${context}, event: ${event.type}`,
                'deleteData label'
              ),
            },
          },
        },
        success: {
          entry: ['setResults', 'setPageData'],
          on: {
            FETCH: {
              target: 'loading',
              actions: log(
                (context, event) => `count: ${context}, event: ${event.type}`,
                'Finish label'
              ),
            },
            CREATE: 'creating',
            UPDATE: 'updating',
            DELETE: 'deleting',
          },
          initial: 'unknown',
          states: {
            unknown: {
              on: {
                '': [{ target: 'withData', cond: 'hasData' }, { target: 'withoutData' }],
              },
            },
            withData: {},
            withoutData: {},
          },
        },
        failure: {
          entry: ['setMessage'],
          on: {
            FETCH: 'loading',
          },
        },
      },
    },
    {
      actions: {
        setResults: assign((ctx, event) => {
          // old data在ctx; 新携带在event
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return { results: event.data?.results || ctx.results };
        }),
        setPageData: assign((ctx, event) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return { pageData: omit(event.data, 'results') };
        }),
        setMessage: /* istanbul ignore next */ assign((ctx, event) => ({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          message: event.data?.message,
        })),
      },
      guards: {
        hasData: (ctx) => !!ctx.results && ctx.results.length > 0,
      },
    }
  );
}
