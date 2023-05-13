export const roles = [
  {
    name: 'super admin',
  },
  {
    name: 'admin',
  },
  {
    name: 'vendor',
  },
];

export const globalRoles = ['super admin', 'admin', 'vendor'];

export enum ROLES {
  OWNER = 'super admin',
  USER = 'admin',
  VENDOR = 'vendor',
}
