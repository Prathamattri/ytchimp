import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AxiosRequestConfig } from "axios";
import {
  Box,
  Button,
  FormGroup,
  Input,
  Typography,
} from "@mui/material";
import { api2 } from "@/utils";
import { useRecoilValue } from "recoil";
import { userAuthState, userLoadingState } from "@/store/selectors";
import { config } from "dotenv";

const Upload = () => {
  const [vidFile, setVidFile] = useState<File>();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [thumbnail, setThumnbail] = useState<File>();

  const isAuthenticated = useRecoilValue(userAuthState);
  const isLoading = useRecoilValue(userLoadingState);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading]);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    if (vidFile && title && description) {
      const packetSize = 5 * 1024 * 1024;
      let partsQty = Math.ceil(vidFile.size / packetSize)

      let sliceStart = 0;
      for (let partNum = 1; partNum <= partsQty; partNum++) {
        let sliceEnd = Math.min(sliceStart + packetSize, vidFile.size);
        let fileSlice = vidFile.slice(sliceStart, sliceEnd);

        formData.append("vidFile", fileSlice, `${partNum}`);
        formData.set("total_parts", `${partsQty}`);
        formData.set("part_number", `${partNum}`);
        // formData.append("title", title);
        // formData.append("description", description);
        // formData.append("workspaceId", `${router.query.ws}`);
        // if (thumbnail) formData.append("thumbnail", thumbnail);

        const headers = new Headers()
        headers.append('Content-Range', `bytes ${sliceStart}-${sliceEnd - 1}/${vidFile.size}`)
        headers.append("Part-To-Process", `${partNum}`);
        try {
          // const xhr = new XMLHttpRequest();
          // xhr.open("POST", `${process.env.NEXT_PUBLIC_serverURL}/workspace/${router.query.ws}/upload/video`, true);
          // xhr.setRequestHeader('Content-Range', `bytes ${sliceStart}-${sliceEnd - 1}/${vidFile.size}`)
          // xhr.withCredentials = true;
          // xhr.send(formData)
          const res = await fetch(`${process.env.NEXT_PUBLIC_serverURL}/workspace/${router.query.ws}/upload/video`, {
            method: "POST",
            credentials: 'include',
            headers: headers,
            body: formData
          })
          const { uploadId } = await res.json()
          if (uploadId) {
            formData.set("uploadId", uploadId)
          }
          console.log(uploadId);
          if (!res.ok) {
            throw new Error("Fetch request error: " + res)
          }
          // const res = await api2.post(
          //   `/workspace/${router.query.ws}/upload/server`,
          //   formData as AxiosRequestConfig<any>,
          // );
          // console.log(res.data);
        } catch (error) {
          console.log(error);
          // break;
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
    </div>
  );
};

export default Upload;
