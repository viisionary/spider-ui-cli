import { assign, createMachine } from "xstate";

export type DataDetailEvents = { type: "FETCH" } | { type: "UPDATE" } | { type: "RESET" };

export type DataDetailsContext<DetailsContext> = {
  results: DetailsContext;
};

/**
 * DESC 单个项目的 create & detail & update
 * @param machineId
 */
export function dataDetailMachine<DetailsContext>(machineId: string) {
  // @ts-ignore
  return createMachine<any, DataDetailsContext<DetailsContext>, DataDetailEvents>(
    {
      id: machineId,
      initial: "idle",
      // @ts-ignore
      context: { result: undefined },
      states: {
        idle: {
          on: {
            // UPDATE: 'loading',
            FETCH: "loading",
            RESET: {
              actions: assign({
                                results() {
                                  console.log("chongzhi");
                                  return {};
                                }
                              })
            }
          }
        },
        loading: {
          invoke: {
            src: "fetchData",
            onDone: {
              target: "success",
              actions: assign({
                                results: function(context, event) {
                                  return event.data;
                                }
                              })
            },
            onError: { target: "failure" }
          }
        },
        updating: {},
        success: {
          on: {
            // UPDATE: 'loading',
            FETCH: "loading",
            RESET: {
              target: "idle",
              actions: assign({
                                results() {
                                  return {};
                                }
                              })
            }
          },
        },
        failure: {
          on: {
            // UPDATE: 'loading',
            FETCH: "loading"
          }
        }
      }
    });
}
