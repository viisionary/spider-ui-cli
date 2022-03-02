//@ts-nocheck
import React, { useEffect, useRef } from "react";
import { Box, Button, IconButton, SvgIcon, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Resumable from "resumablejs";
import { List } from "immutable";
import PauseCircleOutlineIcon from "@mui/icons-material/Pause";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayArrow";
import { Delete } from "@mui/icons-material";
import { LinearProgressWithLabel } from "./LinearProgressWithLabel";

/**
 Created by IntelliJ IDEA.
 User: visionary
 Date: 2021/11/14
 Time: 8:33 PM

 描述：
 **/

interface Props {
  max?: number;
  onComplete: (filesMd5: string[]) => void;
  onChange: (filesMd5: string[]) => void;
  accept: string;
}

const useStyles = makeStyles((theme) =>
  ({
    Upload: {}
  })
);
const enduranceFilesList = (files: any) => {
  localStorage.setItem("filesList", JSON.stringify(files));
};

const getFilesList = () => {
  //@ts-ignore
  return JSON.parse(localStorage.getItem("filesList")) || [];
};

const ResumableUpload: React.FC<Props> = () => {
  //@ts-ignore
  const [files, setFiles] = React.useState<any[]>(List([]));
  const uploadBtn = useRef();
  const uploadSquare = useRef();
  const resumableClient = useRef();

  useEffect(() => {
    const formattedFiles = files.map(({ file, progressRate }) => ({
      file: {
        fileName: file.fileName,
        uniqueIdentifier: file.uniqueIdentifier,
        size: file.size
      },
      progressRate,
      status: "paused"
    }));
    enduranceFilesList(formattedFiles);
  }, [files]);
  const classes = useStyles();
  useEffect(() => {
    resumableClient.current = new Resumable({
      target: "/api/upload/resumable",
      method: "post"
      // query: { upload_token: "my_token" }
    });
    uploadBtn && resumableClient.current.assignBrowse(uploadSquare.current);
    uploadSquare && resumableClient.current.assignDrop(uploadSquare.current);

    resumableClient.current.on("fileAdded", function(file, event) {
      console.info(file);
      const index = files.findIndex(
        (fileInfo) => fileInfo.file.uniqueIdentifier === file.uniqueIdentifier
      );
      if (index > -1) {
        setFiles((pre) =>
          pre.update(index, (preFile) => ({
            status: "ready",
            file,
            progressRate: preFile.progressRate
          }))
        );
        return;
      }
      setFiles((pre) => pre.push({ file, status: "ready", progressRate: 0 }));
    });
    resumableClient.current.on("fileSuccess", function(file, message) {
      try {
        const { uniqueIdentifier, progress } = file;
        setFiles((pre) =>
          pre.update(
            pre.findIndex(
              (fileInfo) => fileInfo.file.uniqueIdentifier === uniqueIdentifier
            ),
            (fileInfo) => ({
              ...fileInfo,
              status: "done",
              address: message
            })
          )
        );
      } catch (e) {
        console.warn(e);
      }
    });
    resumableClient.current.on("fileError", function(file, message) {
      try {
        file.pause();
        const { uniqueIdentifier, progress } = file;
        setFiles((pre) =>
          pre.update(
            pre.findIndex(
              (fileInfo) => fileInfo.file.uniqueIdentifier === uniqueIdentifier
            ),
            (fileInfo) => ({
              ...fileInfo,
              status: "error"
            })
          )
        );
      } catch (e) {
        console.warn(e);
      }
    });
    resumableClient.current.on("fileProgress", function(file, message) {
      try {
        const { uniqueIdentifier, progress, chunks } = file;
        setFiles((pre) =>
          pre.update(
            pre.findIndex(
              (fileInfo) => fileInfo.file.uniqueIdentifier === uniqueIdentifier
            ),
            (fileInfo) => ({
              ...fileInfo,
              progressRate: progress() * 100,
              status: "uploading"
            })
          )
        );
      } catch (e) {
        console.warn(e);
      }
    });
    resumableClient.current.on("uploadStart", function(file, message) {
      try {
        const { uniqueIdentifier, progress } = file;
        setFiles((pre) =>
          pre.update(
            pre.findIndex(
              (fileInfo) => fileInfo.file.uniqueIdentifier === uniqueIdentifier
            ),
            (fileInfo) => ({
              ...fileInfo,
              status: "uploading"
            })
          )
        );
      } catch (e) {
        console.warn(e);
      }
    });
  }, [uploadBtn]);
  const handleStartUpload = (file, index) => {
    if (!file.retry) {
      uploadSquare.current.click();
      return;
    }
    file.retry();
  };
  const handlePause = (file) => {
    try {
      file.pause();
      const { uniqueIdentifier, progress } = file;
      setFiles((pre) =>
        pre.update(
          pre.findIndex(
            (fileInfo) => fileInfo.file.uniqueIdentifier === uniqueIdentifier
          ),
          (fileInfo) => ({
            ...fileInfo,
            status: "paused"
          })
        )
      );
    } catch (e) {
      console.warn(e);
    }
  };
  const handleDelete = (file, index) => {
    file.abort && file.abort();
    setFiles((pre) => pre.delete(index));
  };
  return <Box className={classes.Upload}>
    <Button
      variant="outlined"
      ref={uploadSquare}
    >
      上传文件
    </Button>
    <Box>{files.map(({ file, status, progressRate, address }, index) => {
      const {
        fileName,
        uniqueIdentifier,
        chunks,
        progress,
        size
      } = file;
      return (<Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent:'space-between' }}>
            <Typography component="span" sx={{ flex: 1, display: "inline-flex" }}>
              <SvgIcon color={"disabled"}>
                <PauseCircleOutlineIcon
                  fontSize="small" />
              </SvgIcon> {fileName}</Typography>
            {["ready", "error", "paused"].includes(status) && (
              <IconButton
                color="primary"
                onClick={() => handleStartUpload(file, index)}
                aria-label="delete"
                size={"small"}
              >
                <PlayCircleOutlineIcon fontSize="small" />
              </IconButton>
            )}
            {["uploading", "error"].includes(status) && (
              <IconButton
                color="primary"
                onClick={() => handlePause(file, index)}
                aria-label="pause"
                size={"small"}
              >
                <PauseCircleOutlineIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              color="primary"
              onClick={() => handleDelete(file, index)}
              aria-label="delete">
              <Delete fontSize="small" />
            </IconButton>
          </Box>
          {/*<Typography color="primary">*/}
          {/*  {status === "uploading" && "正在上传"}*/}
          {/*  {status === "error" && "上传出错"}*/}
          {/*  {status === "paused" && "已暂停"}*/}
          {/*  {status === "ready" && "待上传"}*/}
          {/*  {status === "done" && "上传成功"}*/}
          {/*</Typography>*/}
          <LinearProgressWithLabel value={30} progress={progressRate} />

        </Box>

      </Box>);
    })}
    </Box>
    <Typography>支持扩展名：.png .jpg .jpeg，最多上传5个文件</Typography>
  </Box>;
};
export default ResumableUpload;
