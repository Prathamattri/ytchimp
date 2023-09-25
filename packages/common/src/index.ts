import { z } from "zod";

export const UserObject = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
});
export const WorkspaceObject = z.object({
  id: z.string(),
  name: z.string(),
  expiresIn: z.date(),
  createdOn: z.date(),
  participants: z.array(
    z.object({
      id: z.string(),
    })
  ),
});

export type UserObjectTypes = z.infer<typeof UserObject>;

export type WorkspaceObjectTypes = z.infer<typeof WorkspaceObject>;
