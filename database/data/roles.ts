export const roles = [
  {
    name: "super admin",
    description: "This is the owner of the application",
  },
  {
    name: "admin",
    description: "create,view,edit & delete personal detail. ",
  },
  {
    name: "vendor",
    description: "create,view,edit & delete personal detail. ",
  },
];

export const globalRoles = ["super admin", "admin", "vendor"];

export enum ROLES {
  OWNER = "super admin",
  USER = "admin",
  VENDOR = "vendor",
}
