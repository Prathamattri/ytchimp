import { atom } from "recoil";

export const alertUser = atom({
  key: "alertUser",
  default: [
    {
      message: "",
      type: "",
      id: "",
    },
  ],
});
