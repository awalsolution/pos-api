export const roleHasPermission = [
  {
    role: "owner",
    permissions: [
      "can_create_users",
      "can_view_users",
      "can_edit_users",
      "can_delete_users",
    ],
  },
  {
    role: "user",
    permissions: [
      "create_profile",
      "view_profile",
      "edit_profile",
      "delete_profile",
    ],
  },
];
