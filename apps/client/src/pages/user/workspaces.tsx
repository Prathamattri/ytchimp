import Loader from "@/components/loader";
import WorkspaceCard from "@/components/workspaceCard";
import { userWorkspaces } from "@/store/atoms/workspace";
import { userAuthState, userLoadingState } from "@/store/selectors/";
import { BASE_URL } from "@/utils";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Grid, Button } from "@mui/material";

const Workspaces = () => {
  const router = useRouter();
  const isAuthenticated = useRecoilValue(userLoadingState);
  const isLoading = useRecoilValue(userAuthState);
  const [workspace, setWorkspace] = useRecoilState(userWorkspaces);
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
      return;
    }
    async function fetchWS() {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/workspace`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkspace({
        data: res.data.ws,
        isLoading: false,
      });
    }
    fetchWS();
  }, [isLoading]);

  const workspaceComponent = workspace.data.map((ws) => (
    <WorkspaceCard
      key={ws.id}
      id={ws.id}
      name={ws.name}
      participants={ws.participants}
    />
  ));

  return (
    <div>
      <CardHeader />
      {workspace.isLoading ? (
        <Loader />
      ) : workspace.data.length === 0 ? (
        <h3 style={{ textTransform: "uppercase", textAlign: "center" }}>
          Create a workspace
        </h3>
      ) : (
        workspaceComponent
      )}
    </div>
  );
};

const CardHeader = () => {
  return (
    <Grid
      container
      sx={{
        width: "100vw",
        px: 5,
        py: 2,
        mb: 1,
        backgroundColor: "#aaa",
        alignItems: "center",
        textTransform: "uppercase",
      }}
      columnGap={1}
    >
      <Grid item xs={4}>
        <h3>Channel Name</h3>
      </Grid>
      <Grid item xs>
        <h4>Participants</h4>
      </Grid>
      <Grid item xs={3} container gap={1}>
        <h4>Manage</h4>
      </Grid>
    </Grid>
  );
};
export default Workspaces;
