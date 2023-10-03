import { atom } from "recoil";

export const userWorkspaces = atom({
  key: "userWorkspaces",
  default: {
    wsCreated: [
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
    wsIn: [
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
