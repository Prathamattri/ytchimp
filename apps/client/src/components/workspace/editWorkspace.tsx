import { alertUser } from "@/store/atoms/alert";
import { userWorkspaces } from "@/store/atoms/workspace";
import { api } from "@/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import { WorkspaceObjectTypes } from "common";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
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
  const setWorkspaces = useSetRecoilState(userWorkspaces);
  const setAlert = useSetRecoilState(alertUser);

  const handleClickOpen = () => {
    setOpen(true);
    fetchWsData();
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
    try {
      const res = await api.post(`/workspace/${id}/update`, {
        ...formData,
      });
      setWorkspaces((prevData) => ({
        ...prevData,
        update: prevData.update + 1,
      }));
      setAlert([
        {
          id: uuidv4(),
          type: "success",
          message: res.data.msg,
        },
      ]);
    } catch (error: any) {
      setAlert([
        {
          id: uuidv4(),
          type: "error",
          message: error.reponse.data.msg,
        },
      ]);
    }
    setOpen(false);
  }

  async function handleUpdate(e: any) {
    const { name, value } = e.target;
    // console.log();

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  async function handleDelete() {
    try {
      const proceed = confirm("Are you sure you want to delete the workspace?");
      if (proceed) {
        const res = await api.delete(`/workspace/${id}`);
        setAlert([
          {
            id: uuidv4(),
            type: "success",
            message: res.data.msg,
          },
        ]);

        setWorkspaces((prevData) => ({
          ...prevData,
          update: prevData.update + 1,
        }));
      }
    } catch (error: any) {
      console.log(error);

      setAlert([
        {
          id: uuidv4(),
          type: "error",
          message: error.reponse.data.msg,
        },
      ]);
    }
    setOpen(false);
  }

  useEffect(() => {
    fetchWsData();
  }, []);

  return (
    <div style={{ display: `${!owned ? "none" : "block"}` }}>
      <Button variant="outlined" onClick={handleClickOpen} disabled={!owned}>
        Edit
      </Button>
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
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                Workspace Pariticipants
                <Info sx={{ fontSize: "1rem" }} />
              </div>
            }
            type="text"
            fullWidth
            variant="standard"
            name="participants"
            title="Add emails of editors seperated by spaces"
            value={formData.participants}
            onChange={handleUpdate}
          />
          <Button
            variant="contained"
            color="error"
            sx={{ marginTop: "2rem" }}
            onClick={handleDelete}
          >
            Delete Workspace
          </Button>
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
