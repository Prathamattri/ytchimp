import { alertUser } from "@/store/atoms/alert";
import { userWorkspaces } from "@/store/atoms/workspace";
import { api } from "@/utils";
import { MoreVert, SettingsSharp } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";
import { WorkspaceObjectTypes } from "common";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";

interface FormDataType
  extends Omit<
    WorkspaceObjectTypes,
    "participants" | "expiresIn" | "createdOn"
  > {
  participants: string;
}
const EditWorkspace = ({ id, owned }: { id: string; owned: boolean }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    id: "",
    name: "",
    participants: "",
  });
  const [workspaces, setWorkspaces] = useRecoilState(userWorkspaces);
  const setAlert = useSetRecoilState(alertUser);

  const handleClickOpen = () => {
    setOpen(true);
    const ws = workspaces.wsCreated.find(ws => ws.id == id)
    if (ws != undefined) {

      setFormData({
        ...ws,
        participants: ws.participants
          .map((item: any) => item.email)
          .join(" "),
      });
    } else {
      fetchWsData();
    }

  };

  const handleClose = () => {
    setOpen(false);
  };

  async function fetchWsData() {
    const res = await api.get(`/workspace/${id}`);
    setFormData({
      ...res.data,
      participants: res.data.participants
        .map((item: any) => item.email)
        .join(" "),
    });
  }
  async function handleSubmit() {
    const res = await api.post(`/workspace/${id}/update`, {
      ...formData,
    });
    setWorkspaces((prevData) => ({
      ...prevData,
      update: prevData.update + 1,
    }));
    setOpen(false);
    setAlert([
      {
        id: uuidv4(),
        type: "success",
        message: res.data.msg,
        markShown: false,
      },
    ]);
  }

  async function handleUpdate(e: any) {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  useEffect(() => {
    fetchWsData();
  }, []);

  return (
    <div style={{ display: `${!owned ? "none" : "block"}` }}>
      <div>
        <SettingsSharp onClick={handleClickOpen} />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent sx={{ padding: "2rem" }}>
          <DialogContentText>WORKSPACE DETAILS</DialogContentText>
          <br />
          <TextField
            disabled
            id="wsID"
            label="Workspace ID"
            name="id"
            value={formData.id}
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="wsName"
            label="Workspace Name"
            type="text"
            fullWidth
            variant="standard"
            name="name"
            value={formData.name}
            onChange={handleUpdate}
          />
          <TextField
            autoFocus
            margin="dense"
            id="wsParticipants"
            label="Workspace Participants"
            type="text"
            fullWidth
            variant="standard"
            name="participants"
            value={formData.participants}
            onChange={handleUpdate}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditWorkspace;
