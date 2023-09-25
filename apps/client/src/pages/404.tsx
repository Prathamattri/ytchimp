import { Box, Typography } from "@mui/material";
import React from "react";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 20,
        px: 5,
      }}
    >
      <Typography variant="h4">
        Oops! Looks like this page haven't been built yet
      </Typography>
    </Box>
  );
};

export default NotFound;
