import { userState } from "../atoms/user";
import { selector } from "recoil";

export const userAuthState = selector({
  key: "userAuthState",
  get: ({ get }) => {
    const state = get(userState);
    return state.isAuthenticated;
  },
});
