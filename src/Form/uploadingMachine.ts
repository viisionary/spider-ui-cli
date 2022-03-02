import { assign, createMachine, interpret } from "xstate";
import { findIndex, isEmpty } from "lodash";

export type Event = { type: string; queue: unknown[]; } | { type: "CANCEL", uniqueIdentifier: string }
// @ts-ignore
export const uploadingMachine =
  createMachine<any, Event, any>(
    {
      id: "fetch",
      initial: "invisible",
      states: {
        visible: {
          on: {
            HIDE: { target: "invisible" },
            PUSH: { target: "visible", actions: ["push"] },
            UPDATE: { target: "visible", actions: ["update"] },
            PAUSE: { target: "visible", actions: ["pause"] },
            UPLOAD: { target: "visible", actions: ["upload"] },
            CANCEL: { target: "visible", actions: ["cancel"] }
          }
        },
        invisible: {
          on: {
            SHOW: { target: "visible" },
            PUSH: { target: "invisible", actions: ["push"] },
            UPDATE: { target: "invisible", actions: ["update"] },
            PAUSE: { target: "invisible", actions: ["pause"] },
            UPLOAD: { target: "invisible", actions: ["upload"] },
            CANCEL: { target: "invisible", actions: ["cancel"] }
          },
          meta: {
            alert: "文件将在后台继续传输。"
          }
        }
      },
      context: {
        queue: [],
        filesInfo: []
      }
    }, {
      actions: {
        push: assign((context, event) => {
          // @ts-ignore
          const customMd5s = event.queue.map(item => item.customMd5);
          // @ts-ignore
          console.info(event);
          // @ts-ignore
          uploadWorker.postMessage({
                                     "push": {
                                       // @ts-ignore
                                       queue: event.queue,
                                       // @ts-ignore
                                       uuid: event.queue[0]?.uuid,
                                       // @ts-ignore
                                       customMd5s
                                     }
                                   });
          // @ts-ignore
          return { queue: context.queue.concat(...event.queue) };
        }),
        // @ts-ignore
        update: assign((context, event) => {
          // @ts-ignore
          if (event.filesInfo.states === UPLOAD_STATES.CANCELED) {
            // 删除
            // @ts-ignore
            const filesInfo = context.filesInfo.filter(item => (item.uniqueIdentifier !== event.filesInfo.uniqueIdentifie));
//
            return { filesInfo };
          }

          // @ts-ignore
          const currentIndex = findIndex(context.filesInfo, ["uniqueIdentifier", event.filesInfo.uniqueIdentifier]);
          // 新增
          if (currentIndex < 0) {
            // return { filesInfo: context.filesInfo };
            // @ts-ignore
            // desc: 只能用 added 状态新增
            if (event.filesInfo.states!==UPLOAD_STATES.ADDED){
              return;
            }
            // @ts-ignore

            return { filesInfo: context.filesInfo.concat(event.filesInfo) };
          }
          // 修改
          // @ts-ignore
          if (event.filesInfo.state !== UPLOAD_STATES.SUCCESS && context.filesInfo[currentIndex].states === UPLOAD_STATES.SUCCESS) {
            // 原来的状态是已成功则不辩
            return { filesInfo: context.filesInfo };
          }
          const newFilesInfo = Array.from(context.filesInfo);

          // @ts-ignore
          newFilesInfo[currentIndex] = event.filesInfo;

          return { filesInfo: newFilesInfo };
        }),
        // @ts-ignore
        upload: assign((context, event) => {
          uploadWorker.postMessage({
                                     // @ts-ignore
                                     "start": event.uniqueIdentifier
                                   });
        }),
        pause: assign((context, event) => {
          uploadWorker.postMessage({
                                     // @ts-ignore
                                     "pause": event.uniqueIdentifier
                                   });
          // @ts-ignore
          const currentIndex = findIndex(context.filesInfo, ["uniqueIdentifier", event.uniqueIdentifier]);
          const newFilesInfo = Array.from(context.filesInfo);

          // @ts-ignore
          newFilesInfo[currentIndex] = {
            ...context.filesInfo[currentIndex],
            states: UPLOAD_STATES.PAUSED
          };
          return { filesInfo: newFilesInfo };


        }),
        // @ts-ignore
        cancel: assign((context, event) => {
          // @ts-ignore
          uploadWorker.postMessage({
                                     // @ts-ignore
                                     "cancel": event.uniqueIdentifier
                                   });
          // @ts-ignore
          const filesInfo = context.filesInfo.filter(item => {
            // @ts-ignore
            return (item.uniqueIdentifier !== event.uniqueIdentifier);
          });
//
          return { filesInfo };

        })
      }
    });

export enum UPLOAD_STATES {
  ADDED = "ADDED",
  UPLOADING = "UPLOADING",
  PAUSED = "PAUSED",
  FAILURE = "FAILURE",
  SUCCESS = "SUCCESS",
  CANCELED = "CANCELED"
}

export const UPLOAD_STATUS_TEXT = {
  [UPLOAD_STATES.ADDED]: "已添加",
  [UPLOAD_STATES.UPLOADING]: "上传中",
  [UPLOAD_STATES.PAUSED]: "已暂停",
  [UPLOAD_STATES.FAILURE]: "上传失败",
  [UPLOAD_STATES.SUCCESS]: "上传成功",
  [UPLOAD_STATES.CANCELED]: "已取消"
};

// 初始化 client

export const uploadWorker = new Worker("/work.js", {});

const accessToken = localStorage.getItem(
  process.env.REACT_APP_AUTH_TOKEN_NAME || "Authorization"
);
uploadWorker.postMessage({
                           // @ts-ignore
                           "Authorization": accessToken
                         });

const messageQueue: any[] = [];
// setInterval(() => {
//   if (isEmpty(messageQueue)){
//     return;
//   }
//   const { type, fileName, size, uniqueIdentifier, progress, uuid, customMd5 } = messageQueue.shift();
//   console.info('保证消息顺序',type)
// }, 1000);
uploadWorker.onmessage = function(message) {
  // messageQueue.push(message.data);
  // @ts-ignore
  const { type, fileName, size, uniqueIdentifier, progress, uuid, customMd5 } = message.data;
  switch (type) {
    case "fileAdded":
      uploadingService.send("UPDATE", {
        filesInfo: {
          fileName,
          uniqueIdentifier,
          size,
          id: uniqueIdentifier,
          states: UPLOAD_STATES.ADDED,
          uuid,
          customMd5
        }
      });

      break;
    case "fileProgress":
      uploadingService.send("UPDATE", {
        filesInfo: {
          fileName,
          uniqueIdentifier,
          size,
          id: uniqueIdentifier,
          states: UPLOAD_STATES.UPLOADING,
          progress,
          uuid,
          customMd5
        }
      });
      return;
    case "fileSuccess": {
      uploadingService.send("UPDATE", {
        filesInfo: {
          fileName,
          uniqueIdentifier,
          size,
          id: uniqueIdentifier,
          states: UPLOAD_STATES.SUCCESS,
          progress,
          uuid,
          customMd5
        }
      });
      return;
    }
    case "fileError": {
      uploadingService.send("UPDATE", {
        filesInfo: {
          fileName,
          uniqueIdentifier,
          size,
          id: uniqueIdentifier,
          states: UPLOAD_STATES.FAILURE,
          // progress,
          uuid,
          customMd5
        }
      });
    }
      break;
    case "cancel": {
      uploadingService.send("UPDATE", {
        filesInfo: {
          fileName,
          uniqueIdentifier,
          size,
          id: uniqueIdentifier,
          states: UPLOAD_STATES.CANCELED,
          progress, uuid,
          customMd5
        }
      });
    }
  }
};

export const uploadingService = interpret(uploadingMachine).onTransition((state: any) => {
  if (state.changed) {
    console.info("uploadingService", state.event.type, state.event.filesInfo);
  }
}).start();