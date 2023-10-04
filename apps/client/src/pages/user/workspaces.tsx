import Loader from "@/components/loader";
import WorkspaceCard from "@/components/workspaceCard";
import { userWorkspaces } from "@/store/atoms/workspace";
import { userAuthState, userLoadingState } from "@/store/selectors/";
import api from "@/utils";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const Workspaces = () => {
  const router = useRouter();
  const isAuthenticated = useRecoilValue(userAuthState);
  const isLoading = useRecoilValue(userLoadingState);
  const [workspace, setWorkspace] = useRecoilState(userWorkspaces);
  async function fetchWS() {
    const res = await api.get(`/workspace`);
    setWorkspace({
      wsCreated: res.data.ws?.createdWorkspaces,
      wsIn: res.data.ws?.participantInWS,
      isLoading: false,
    });
  }
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    } else {
      fetchWS();
    }
  }, [isAuthenticated, isLoading]);

  return (
    <div>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>S. NO.</TableCell>
            <TableCell>Channel Name</TableCell>
            <TableCell align="right">Team Size</TableCell>
            <TableCell align="right">Manage</TableCell>
          </TableRow>
        </TableHead>
        {workspace.isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4}>
                <Loader />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : workspace.wsCreated.length === 0 && workspace.wsIn.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4}>
                <h3 style={{ textTransform: "uppercase", textAlign: "center" }}>
                  Create a workspace
                </h3>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <WorkspaceComponent />
        )}
      </Table>
    </div>
  );
};

const WorkspaceComponent = () => {
  const workspace = useRecoilValue(userWorkspaces);
  const wsCreated = workspace.wsCreated.map((ws, index) => (
    <WorkspaceCard
      owned={true}
      key={ws.id}
      id={ws.id}
      name={ws.name}
      participants={ws.participants}
      index={index}
    />
  ));
  const wsIn = workspace.wsIn.map((ws, index) => (
    <WorkspaceCard
      owned={false}
      key={ws.id}
      id={ws.id}
      name={ws.name}
      participants={ws.participants}
      index={index}
    />
  ));
  return (
    <TableBody>
      {workspace.wsCreated.length && (
        <TableRow>
          <TableCell
            colSpan={4}
            height={80}
            sx={{
              fontWeight: "500",
              textAlign: "center",
              bgcolor: "#fbaaaa",
              color: "white",
              fontSize: "2rem",
              textTransform: "uppercase",
            }}
          >
            OWNER + Editor privileges
          </TableCell>
        </TableRow>
      )}
      {wsCreated}
      {workspace.wsIn.length !== 0 && (
        <TableRow>
          <TableCell
            colSpan={4}
            height={80}
            sx={{
              fontWeight: "500",
              textAlign: "center",
              bgcolor: "#fbaaaa",
              color: "white",
              fontSize: "2rem",
              textTransform: "uppercase",
            }}
          >
            EDITOR Only privileges
          </TableCell>
        </TableRow>
      )}
      {wsIn}
    </TableBody>
  );
};

export default Workspaces;
