import { api } from "@/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

interface PropType {
  fetchWS: Function;
}

const NewWorkspace = ({ fetchWS }: PropType) => {
  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const res = await api.post("/workspace/new", { name: workspaceName });

    fetchWS();

    setOpen(false);
    setWorkspaceName("");
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ margin: "0.5rem" }}
      >
        Create New Workspace
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            To create a new workspace, enter a name in the field below and click
            on create
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="wsName"
            label="Workspace Name"
            type="text"
            fullWidth
            variant="standard"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewWorkspace;
