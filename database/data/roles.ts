export const roles = [
  {
    name: "owner",
    description: "This is the owner of the application",
  },
  {
    name: "user",
    description: "create,view,edit & delete personal detail. ",
  },
  {
    name: "vendor",
    description: "create,view,edit & delete personal detail. ",
  },
];

export const globalRoles = ["owner", "user", "vendor"];

export enum ROLES {
  OWNER = "owner",
  USER = "user",
  VENDOR = "vendor",
}
