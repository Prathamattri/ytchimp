import { userState } from "../atoms/user";
import { selector } from "recoil";

export const userDetailState = selector({
  key: "userDetailState",
  get: ({ get }) => {
    const state = get(userState);
    return {
      userName: state.userName,
      userEmail: state.userEmail,
    };
  },
});
