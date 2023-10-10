import { selector } from "recoil";
import { userWorkspaces } from "../atoms/workspace";

export const workspaceUpdateState = selector({
  key: "workspaceUpdateState",
  get: ({ get }) => {
    const state = get(userWorkspaces);
    return state.update;
  },
});
