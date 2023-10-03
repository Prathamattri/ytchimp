import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios, { AxiosRequestConfig } from "axios";
import {
  Box,
  Button,
  FormGroup,
  Input,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import api, { api2 } from "@/utils";
import { useRecoilValue } from "recoil";
import { userAuthState, userLoadingState } from "@/store/selectors";

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
      formData.append("vidFile", vidFile, vidFile.name);
      formData.append("title", title);
      formData.append("description", description);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await api2.post(
        `/workspace/${router.query.ws}/upload`,
        formData as AxiosRequestConfig<any>
      );
      console.log(res.data);
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
