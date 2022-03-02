import * as React from "react";
import {useEffect, useRef} from "react";
import {makeStyles} from "@mui/styles";
import {Box, Button, FormHelperText, IconButton, Typography} from "@mui/material";
import styled from "@emotion/styled";
import {useActor} from "@xstate/react";
import {useField} from "formik";
import SvgIcon from "@mui/material/SvgIcon";
import {v4 as uuidv4} from "uuid";
import map from "lodash/map";
import filter from "lodash/filter";
import PauseCircleOutlineIcon from "@mui/icons-material/Pause";
import {every} from "lodash";
import {UPLOAD_STATES, uploadingService} from "./uploadingMachine";
import getFileContentMd5 from 'spider-utils/file/getFileContentMd5'
import {Close, StartOutlined} from "@mui/icons-material";
import {LinearProgressWithLabel} from "./LinearProgressWithLabel";

const Input = styled("input")({
    display: "none"
});
/**
 Created by IntelliJ IDEA.
 User: visionary
 Date: 2021/12/9
 Time: 5:28 PM
 */
const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: "#fff"
    }
}));

export enum FileDoFileTypeEnum {
    AUDIO = 'AUDIO',
    DOC = 'DOC',
    FOLDER = 'FOLDER',
    IMAGE = 'IMAGE',
    OTHER = 'OTHER',
    VIDEO = 'VIDEO'
}

export enum FileListDoFileTypeEnum {
    AUDIO = 'AUDIO',
    DOC = 'DOC',
    FOLDER = 'FOLDER',
    IMAGE = 'IMAGE',
    OTHER = 'OTHER',
    VIDEO = 'VIDEO'
}

export const getFileLimitByType = (fileType: FileListDoFileTypeEnum) => {
    if (fileType === FileListDoFileTypeEnum.VIDEO) {
        return 1024 * 1024 * 1024 * 2;
    }
    return 1024 * 1024 * 20;

};

export enum FILE_TYPE {
    EXCEL = "EXCEL",
    DOC = "DOC",
    IMAGE = "IMAGE",
    PDF = "PDF",
    PPT = "PPT",
    OTHER = "OTHER",
    VIDEO = "VIDEO",
    FOLDER = "FOLDER",
    AUDIO = "AUDIO"
}

export const FILE_PROPS: Record<FILE_TYPE, any> = {
    [FILE_TYPE.AUDIO]: {
        desc: "音频",
        extension: ["mp3"],
        width: 200,
        type: FILE_TYPE.AUDIO
    },
    [FILE_TYPE.EXCEL]: {
        desc: "幻灯片",
        extension: ["pptx", "ppt"],
        width: 200,
        type: FILE_TYPE.EXCEL
    },
    [FILE_TYPE.PPT]: {
        desc: "表格",
        extension: ["xlsx", "xls"],
        width: 200,
        type: FILE_TYPE.PPT
    },
    [FILE_TYPE.DOC]: {
        desc: "文档",
        extension: ["doc", "docx", "txt"],
        type: FILE_TYPE.DOC
    },
    [FILE_TYPE.IMAGE]: {
        desc: "图片",
        extension: ["png", "jpg", "jpeg"],
        type: FILE_TYPE.IMAGE
    },
    [FILE_TYPE.PDF]: {
        desc: "PDF",
        extension: ["pdf"],
        type: FILE_TYPE.PDF
    },

    [FILE_TYPE.VIDEO]: {
        desc: "视频",
        extension: ["mp4", "mov", "avi"],
        type: FILE_TYPE.VIDEO
    },
    [FILE_TYPE.FOLDER]: {
        desc: "文件夹",
        extension: [""],
        type: FILE_TYPE.FOLDER

    },
    [FILE_TYPE.OTHER]: {
        desc: "其他",
        extension: ["mp4", "mp3", "png", "jpg", "jpeg", "doc", "docx", "txt", "mov", "avi"],
        icon: <div>未知</div>,
        type: FILE_TYPE.OTHER
    }
// [FILE_TYPE.IMAGE]:{}
};
export const getPropsBySuffix: any = (filename: string) => {
    const name = filename.split(".");
    const ext = name[name.length - 1];
    return filter(FILE_PROPS, ({extension}) => extension.includes(ext)) || [{icon: "未知类型"}];
};
export const getTypeByExtra: (filename: string) => FILE_TYPE = (filename) => {
    return getPropsBySuffix(filename)[0]?.type;
};
export const getAcceptByType = (fileType: FileDoFileTypeEnum) => {
    return FILE_PROPS[fileType]?.extension;
};
export default function BaseResumableUpload({max, accept, onAdd, onError, ...props}: any) {
    const [field, meta, helpers] = useField(props);

    const {value, error, initialValue, touched} = meta;

    const uuid = useRef();
    const {setValue, setError, setTouched} = helpers;
    const [uploadingState, sendUploadingState] = useActor(uploadingService);

    const styles = useStyles();


    useEffect(() => {
        uuid.current = uuidv4();
    }, []);
    const files = uploadingState.context.filesInfo;
    const currentFormFiles = uploadingState.context.filesInfo.filter(item => item.uuid === uuid.current);
    useEffect(() => {
        files.forEach(item => {
            sendUploadingState({type: "CANCEL", uniqueIdentifier: item.uniqueIdentifier});
        });
        setValue([]);

    }, [accept]);
    /**
     *  添加后自动开始上传
     */
    useEffect(() => {
        files.forEach(item => {
            if (item.states === UPLOAD_STATES.ADDED) {
                // @ts-ignore
                sendUploadingState({type: "UPLOAD", uniqueIdentifier: item.uniqueIdentifier});
            }
        });

    }, [files]);
    useEffect(() => {
        const reqParams = currentFormFiles.map(({fileName, size, uniqueIdentifier, states}) => ({
            fileSize: size,
            fileName,
            md5: uniqueIdentifier,
            states
        }));
        setValue(reqParams);
    }, [files]);

    const handleAdd = async (e) => {
        const notOver = every(e.target.files, file => {
            const fileType = getTypeByExtra(file.name);
            // @ts-ignore
            const sizeLimit = getFileLimitByType(fileType);
            return file.size < sizeLimit;
        });
        if (!notOver) {
            onError('文件超出大小')
            return;
        }
        const uuidAppendPromise = map(e.target.files, async item => {
            const customMd5 = await getFileContentMd5(item);
            Object.defineProperty(item, "uuid", {
                value: uuid.current,
                writable: true,
                configurable: true,
                enumerable: true
            });
            Object.defineProperty(item, "customMd5", {
                value: customMd5,
                writable: true,
                configurable: true,
                enumerable: true
            });
            return (item);
        });
        const uuidAppend = await Promise.all(uuidAppendPromise);
        sendUploadingState({type: "PUSH", queue: uuidAppend});

    };
    const handleUpload = (row: any) => {
        // @ts-ignore
        sendUploadingState({type: "UPLOAD", uniqueIdentifier: row.uniqueIdentifier});
    };
    const handlePause = (row: any) => {
        // @ts-ignore
        sendUploadingState({type: "PAUSE", uniqueIdentifier: row.uniqueIdentifier});
    };

    const handleCancel = (row: any) => {
        sendUploadingState({type: "CANCEL", uniqueIdentifier: row.uniqueIdentifier});
    };

    return (
        <React.Fragment>
            <label htmlFor="contained-button-file">
                <Input accept={accept} id="contained-button-file" multiple type="file" onChange={handleAdd}/>
                <Button variant="outlined" component="span" color={"secondary"} sx={{marginY: 2}}>
                    上传文件
                </Button>
            </label>
            <Box sx={{maxHeight: 230, overflowY: "auto", overflowX: "hidden"}}>{currentFormFiles.map((file) => {
                const {
                    fileName,
                    progress,
                    states
                } = file;
                return (
                    <Box key={fileName}>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                <Box sx={{flex: 1, display: "inline-flex", flexDirection: "row", alignItems: "center"}}
                                     color={states === UPLOAD_STATES.SUCCESS ? "info" : "secondary"}>
                                    <SvgIcon viewBox={"0 0 14 14"}
                                             fontSize={"small"}
                                             sx={{width: 14, height: 14}}
                                             color={states === UPLOAD_STATES.SUCCESS ? "info" : "secondary"}>
                                        <StartOutlined/>
                                    </SvgIcon>
                                    <Typography marginX={2} maxWidth={200} overflow={"hidden"}
                                                textOverflow={"ellipsis"}>
                                        {fileName}
                                    </Typography>
                                </Box>
                                {[].includes(states) && (
                                    <IconButton
                                        onClick={() => handlePause(file)}
                                        aria-label="pause"
                                        size={"small"}>
                                        <PauseCircleOutlineIcon fontSize="small"/>
                                    </IconButton>
                                )}
                                {[UPLOAD_STATES.ADDED, UPLOAD_STATES.FAILURE, UPLOAD_STATES.PAUSED].includes(states) && (
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleUpload(file)}
                                        aria-label="delete"
                                        size={"small"}
                                    >
                                        <StartOutlined/>
                                    </IconButton>
                                )}
                                <IconButton
                                    color="primary"
                                    size={"small"}
                                    onClick={() => handleCancel(file)}
                                    aria-label="delete">
                                    <Close/>
                                </IconButton>
                            </Box>
                            <LinearProgressWithLabel error={UPLOAD_STATES.FAILURE === states} value={progress || 0}/>
                        </Box>
                    </Box>);
            })}
            </Box>
            {(touched && error) && <FormHelperText>{error}</FormHelperText>}
            <FormHelperText>{`支持扩展名${accept}`}</FormHelperText>
            <FormHelperText>{`最多上传${max}个文件`}</FormHelperText>
        </React.Fragment>
    );
}
