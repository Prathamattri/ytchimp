import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AxiosRequestConfig } from "axios";
import {
  Box,
  Button,
  FormGroup,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { api, api2 } from "@/utils";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAuthState, userLoadingState } from "@/store/selectors";
import WorkspaceInUse from "@/store/atoms/workspaceInUse";

const Upload = () => {
  const router = useRouter();

  const [vidFile, setVidFile] = useState<File>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumnbail] = useState<File>();
  const [thumbnailFeature, setThumnbailFeature] = useState<boolean>(false);
  const isAuthenticated = useRecoilValue(userAuthState);
  const isLoading = useRecoilValue(userLoadingState);
  const [workspaceInUse, setWorkspaceInUse] = useRecoilState(WorkspaceInUse);

  const fetchWS = async () => {
    try {
      const res = await api.get(`/workspace/${router.query.ws}`);
      setWorkspaceInUse({
        name: res.data.name,
        owned: res.data.owned,
        owner: res.data.owner,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    } else if (router.isReady) {
      fetchWS();
    }
  }, [isAuthenticated, isLoading, router.isReady]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    if (vidFile && title && description) {
      formData.append("vidFile", vidFile, vidFile.name);
      formData.append("title", title);
      formData.append("description", description);

      if (thumbnail) formData.append("thumbnail", thumbnail);
      router.push("/user/workspaces");

      const res = await api2.post(
        `/workspace/${router.query.ws}/upload`,
        formData as AxiosRequestConfig<any>
      );
      console.log(res.data);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        padding={2}
        sx={{
          maxWidth: { sm: "100vw", md: "50vw" },
          minWidth: "400px",
        }}
      >
        <Box paddingY={2} sx={{ width: "100%", textAlign: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: "bolder" }}>
            {workspaceInUse.name}
          </Typography>
          <Typography
            fontSize={"small"}
            textTransform={"uppercase"}
            fontWeight={"bold"}
            color={"GrayText"}
          >
            Upload details
          </Typography>
          <Typography
            fontSize={"small"}
            textTransform={"uppercase"}
            fontWeight={"bold"}
            color={"GrayText"}
          >
            OWNER: {workspaceInUse.owner}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <TextField
              margin="dense"
              label="Title"
              variant="standard"
              placeholder="Add a suitable Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </FormGroup>
          <br />
          <FormGroup>
            <TextField
              multiline
              variant="standard"
              label="Description"
              placeholder="Add a suitable Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </FormGroup>
          <br />
          <FormGroup>
            <div>
              <label className="checkbox">
                <input
                  className="sr-only"
                  type="checkbox"
                  name="my-toggle"
                  id="my-toggle"
                  checked={thumbnailFeature}
                  onChange={(e) => setThumnbailFeature(e.target.checked)}
                />
                <div className="slider"></div>
                <span className="label">
                  Are you able to upload thumbnail using YT Studio?
                </span>
              </label>
            </div>
            <label htmlFor="thumbnail">
              <Typography
                color={thumbnailFeature ? "purple" : "GrayText"}
                fontWeight={"bolder"}
                textTransform={"uppercase"}
              >
                ADD Thumbnail{" "}
                <span style={{ fontWeight: "bolder", fontSize: "1.2rem" }}>
                  +
                </span>
              </Typography>
            </label>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              disabled={!thumbnailFeature}
              accept="image/jpeg,image/png"
              onChange={(e) => {
                const fileList = e.target.files;
                if (!fileList) return;
                setThumnbail(fileList[0]);
              }}
              hidden
            />
            <span>{thumbnail ? thumbnail.name : ""}</span>
          </FormGroup>
          <br />
          <FormGroup>
            <label htmlFor="vidFile">
              <Typography
                color={"darkolivegreen"}
                fontWeight={"bolder"}
                textTransform={"uppercase"}
              >
                ADD Video File{" "}
                <span style={{ fontWeight: "bolder", fontSize: "1.2rem" }}>
                  +
                </span>
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
