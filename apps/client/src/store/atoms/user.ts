import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    userEmail: null,
    userName: null,
    isLoading: true,
    isAuthenticated: false,
  },
});
