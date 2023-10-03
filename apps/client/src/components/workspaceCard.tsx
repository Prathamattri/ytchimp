import { WorkspaceObjectTypes } from "common";
import React from "react";
import { Box, Button, Grid, TableRow, TableCell } from "@mui/material";
import Link from "next/link";

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
            <Button variant="outlined" disabled={!props.owned}>
              Edit
            </Button>
          </Grid>
          <Grid item>
            <Link href={`/user/workspace/${props.id}`}>
              <Button variant="contained">Use</Button>
            </Link>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
    // <Grid
    //   container
    //   sx={{
    //     width: "100vw",
    //     px: 5,
    //     py: 2,
    //     mb: 1,
    //     backgroundColor: "#eee",
    //     alignItems: "center",
    //   }}
    //   columnGap={1}
    // >
    //   <Grid item xs={4}>
    //     <p>{props.name}</p>
    //   </Grid>
    //   <Grid item xs>
    //     <em>{props.participants.length + 1}</em>
    //   </Grid>
    //   <Grid item xs={3} container gap={1}>
    //     <Grid item>
    //       <Button variant="outlined">Edit</Button>
    //     </Grid>
    //     <Grid item>
    //       <Link href={`/workspace/${props.id}`}>
    //         <Button variant="contained">Use</Button>
    //       </Link>
    //     </Grid>
    //   </Grid>
    // </Grid>
  );
};

export default WorkspaceCard;
