export const roleHasPermission = [
  {
    role: 'super admin',
  },
  {
    role: 'admin',
    permissions: [
      'can view dashboard',
      'can view system setting',
      'can view users',
      'can view roles',
      'can view permissions',
      'can view shops',
      'can view products',
    ],
  },
  {
    role: 'vendor',
    permissions: [
      'can view products',
      'can view dashboard',
      'can view roles',
      'can view permissions',
    ],
  },
];
