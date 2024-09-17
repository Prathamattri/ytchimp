import { atom } from "recoil";

export type AlertType = {
  message: string;
  type: string;
  id: string;
  markShown: boolean;
};

export const alertUser = atom<AlertType[]>({
  key: "alertUser",
  default: [
    {
      message: "",
      type: "",
      id: "",
      markShown: true,
    },
  ],
});
