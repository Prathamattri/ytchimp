import { WorkspaceObjectTypes } from "common";
import React from "react";
import { Button, Grid, TableRow, TableCell } from "@mui/material";
import Link from "next/link";
import EditWorkspace from "./editWorkspace";

interface cardProps
  extends Pick<WorkspaceObjectTypes, "name" | "participants" | "id"> {
  index: number;
  owned: boolean;
}

const WorkspaceCard = (props: cardProps) => {
  return (
    <TableRow>
      <TableCell>{props.index + 1}</TableCell>
      <TableCell>{props.name}</TableCell>
      <TableCell align="right">{props.participants.length + 1}</TableCell>
      <TableCell>
        <Grid item container gap={1} sx={{ flexDirection: "row-reverse" }}>
          <Grid item>
            <EditWorkspace id={props.id} owned={props.owned} />
          </Grid>
          <Grid item>
            <Link href={`/user/workspace/${props.id}`}>
              <Button variant="contained">Use</Button>
            </Link>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  );
};

export default WorkspaceCard;
