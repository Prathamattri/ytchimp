import { atom } from "recoil";

const WorkspaceInUse = atom({
  key: "WorkspaceInUse",
  default: {
    name: "",
    owned: false,
    owner: "",
  },
});

export default WorkspaceInUse;
