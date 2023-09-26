import { WorkspaceObjectTypes } from "common";
import React from "react";
import { Box, Button, Grid } from "@mui/material";
import Link from "next/link";
const WorkspaceCard = (
  props: Pick<WorkspaceObjectTypes, "name" | "participants" | "id">
) => {
  return (
    <Grid
      container
      sx={{
        width: "100vw",
        px: 5,
        py: 2,
        mb: 1,
        backgroundColor: "#eee",
        alignItems: "center",
      }}
      columnGap={1}
    >
      <Grid item xs={4}>
        <p>{props.name}</p>
      </Grid>
      <Grid item xs>
        <em>{props.participants.length + 1}</em>
      </Grid>
      <Grid item xs={3} container gap={1}>
        <Grid item>
          <Button variant="outlined">Edit</Button>
        </Grid>
        <Grid item>
          <Link href={`/workspace/${props.id}`}>
            <Button variant="contained">Use</Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WorkspaceCard;
