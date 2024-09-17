import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  CircularProgress,
  FormGroup,
  Input,
  Typography,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { userAuthState, userLoadingState } from "@/store/selectors";

type UploadStatusType = {
  percentage: number;
  inProgress: boolean;
  completed: boolean;
  errorMsg: string;
};

const Upload = () => {
  const [vidFile, setVidFile] = useState<File>();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [thumbnail, setThumnbail] = useState<File>();
  const [uploadStatus, setUploadStatus] = useState<UploadStatusType>({
    percentage: 0,
    inProgress: false,
    completed: false,
    errorMsg: "",
  });

  const isAuthenticated = useRecoilValue(userAuthState);
  const isLoading = useRecoilValue(userLoadingState);
  const router = useRouter();

  const workspaceName = router.query!.wsname;
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    if (vidFile && title && description) {
      const packetSize = 5 * 1024 * 1024;
      let partsQty = Math.ceil(vidFile.size / packetSize);

      let sliceStart = 0;
      for (let partNum = 1; partNum <= partsQty; partNum++) {
        let sliceEnd = Math.min(sliceStart + packetSize, vidFile.size);
        let fileSlice = vidFile.slice(sliceStart, sliceEnd);

        formData.set("vidFile", fileSlice, `${partNum}`);
        formData.set("total_parts", `${partsQty}`);
        formData.set("part_number", `${partNum}`);
        // formData.append("title", title);
        // formData.append("description", description);
        // formData.append("workspaceId", `${router.query.ws}`);
        // if (thumbnail) formData.append("thumbnail", thumbnail);

        const headers = new Headers();
        headers.append(
          "Content-Range",
          `bytes ${sliceStart}-${sliceEnd - 1}/${vidFile.size}`,
        );
        headers.append("Part-To-Process", `${partNum}`);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_serverURL}/workspace/${router.query.ws}/upload/video`,
            {
              method: "POST",
              credentials: "include",
              headers: headers,
              body: formData,
            },
          );
          if (!res.ok) {
            throw new Error("Fetch request error: " + res);
          }
          var completedPercentage = Math.floor((partNum / partsQty) * 100);
          if (partNum == partsQty) {
            setUploadStatus((prevState) => ({
              ...prevState,
              percentage: completedPercentage,
              inProgress: false,
              completed: true,
            }));
          } else {
            setUploadStatus((prevState) => ({
              ...prevState,
              percentage: completedPercentage,
              inProgress: true,
            }));
          }
          const { uploadId } = await res.json();
          if (uploadId) {
            formData.set("uploadId", uploadId);
          }
        } catch (error: any) {
          console.log(error);
          console.error(
            "Error occurred while uploading part number " + partNum,
          );
          setUploadStatus((prevState) => ({
            ...prevState,
            completed: false,
            errorMsg: error.msg,
            inProgress: false,
          }));
          break;
        }
        sliceStart = sliceEnd;
      }
    }
  };
  return (
    <div>
      <Box
        padding={2}
        sx={{ maxWidth: { sm: "100vw", md: "50vw" }, minWidth: "400px" }}
      >
        <div style={{ textAlign: "center" }}>
          <Typography variant="h1"> {workspaceName} </Typography>
          <Typography variant="caption"> {router.query.ws} </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              margin="dense"
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </FormGroup>
          <br />
          <FormGroup>
            <Input
              multiline
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </FormGroup>
          <br />
          <FormGroup>
            <label htmlFor="thumbnail">
              <Typography color={"disabled"} textTransform={"uppercase"}>
                ADD Thumbnail
              </Typography>
            </label>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              accept="image/*"
              onChange={(e) => {
                const fileList = e.target.files;
                if (!fileList) return;
                setThumnbail(fileList[0]);
              }}
              disabled
              hidden
            />
          </FormGroup>
          <br />
          <FormGroup>
            <label htmlFor="vidFile">
              <Typography color={"primary"} textTransform={"uppercase"}>
                ADD Video File
              </Typography>
            </label>
            <input
              accept="video/*"
              type="file"
              name="vidFile"
              onChange={(e) => {
                const fileList = e.target.files;
                if (!fileList) return;
                setVidFile(fileList[0]);
              }}
              required
              hidden
              id="vidFile"
            />
            <span>{vidFile ? vidFile.name : ""}</span>
          </FormGroup>
          <br />
          <Button type="submit" fullWidth variant="contained">
            Submit
          </Button>
        </form>
      </Box>
      <UploadProgress uploadStatus={uploadStatus} />
    </div>
  );
};

const UploadProgress = ({
  uploadStatus,
}: {
  uploadStatus: UploadStatusType;
}) => {
  return (
    <Box>
      <CircularProgress variant="determinate" value={uploadStatus.percentage} />
      {uploadStatus.inProgress && (
        <Typography color={"red"}>Upload is in progress <br />Please do not refresh! </Typography>
      )}
      {uploadStatus.completed && (
        <Typography variant="h3" color={"green"}>
          Upload Complete
        </Typography>
      )}
      {uploadStatus.errorMsg && (
        <Typography color={"red"}>{uploadStatus.errorMsg}</Typography>
      )}
    </Box>
  );
};

export default Upload;
