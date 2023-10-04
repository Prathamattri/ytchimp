import { WorkspaceObjectTypes } from "common";
import React from "react";
import { Box, Button, Grid, TableRow, TableCell } from "@mui/material";
import Link from "next/link";
// import SlackNotify from "slack-notify";
import axios from "axios";
const mywebhookurl = process.env.webhookURL || "";
// const slack = SlackNotify(mywebhookurl);

interface cardProps
  extends Pick<WorkspaceObjectTypes, "name" | "participants" | "id"> {
  index: number;
  owned: boolean;
}

const WorkspaceCard = (props: cardProps) => {
  const handleEdit = async () => {
    // slack
    //   .send("hello")
    //   .then(() => {
    //     console.log("send a message");
    //   })
    //   .catch((err: any) => {
    //     console.error(err);
    //   });
    fetch(mywebhookurl, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "You have a new request:\n*<devopsdeployment.co.in|Fred Enriquez - New device request>*",
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: "*Type:*\nComputer (laptop)",
              },
              {
                type: "mrkdwn",
                text: "*When:*\nSubmitted Aut 10",
              },
              {
                type: "mrkdwn",
                text: "*Last Update:*\nMar 10, 2015 (3 years, 5 months)",
              },
              {
                type: "mrkdwn",
                text: "*Reason:*\nAll vowel keys aren't working.",
              },
              {
                type: "mrkdwn",
                text: '*Specs:*\n"Cheetah Pro 15" - Fast, really fast"',
              },
            ],
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "Approve",
                },
                style: "primary",
                value: "click_me_123",
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "Deny",
                },
                style: "danger",
                value: "click_me_123",
              },
            ],
          },
        ],
      }),
    })
      .then(() => {
        console.log("sent a message");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <TableRow>
      <TableCell>{props.index + 1}</TableCell>
      <TableCell>{props.name}</TableCell>
      <TableCell align="right">{props.participants.length + 1}</TableCell>
      <TableCell>
        <Grid item container gap={1} sx={{ flexDirection: "row-reverse" }}>
          <Grid item>
            {/* <Link href={''}> */}
            <Button
              onClick={handleEdit}
              variant="outlined"
              disabled={!props.owned}
            >
              Edit
            </Button>
            {/* </Link> */}
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
