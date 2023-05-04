export const roleHasPermission = [
  {
    role: "super admin",
    permissions: [
      "can_create_users",
      "can_view_users",
      "can_edit_users",
      "can_delete_users",
    ],
  },
  {
    role: "admin",
    permissions: [
      "create_profile",
      "view_profile",
      "edit_profile",
      "delete_profile",
    ],
  },
  {
    role: "vendor",
    permissions: [
      "create_profile",
      "view_profile",
      "edit_profile",
      "delete_profile",
    ],
  },
];
