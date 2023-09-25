import { atom } from "recoil";

export const userWorkspaces = atom({
  key: "userWorkspaces",
  default: {
    data: [
      {
        id: "",
        name: "",
        expiresIn: null,
        createdOn: null,
        participants: [
          {
            id: "",
          },
        ],
      },
    ],
    isLoading: true,
  },
});
