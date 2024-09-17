import { atom } from "recoil";

export type UserStateType = {
  userEmail: string | null;
  userName: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export const userState = atom<UserStateType>({
  key: "userState",
  default: {
    userEmail: null,
    userName: null,
    isLoading: true,
    isAuthenticated: false,
  },
});
