import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Menu from 'App/Models/Menu';

export default class extends BaseSeeder {
  public async run() {
    await Menu.createMany([
      {
        parent_id: null,
        route_name: 'dashboard',
        menu_url: '/dashboard',
        menu_name: 'Dashbaord',
        menu_order: 1,
        menu_icon: 'DashboardOutlined',
      },
      {
        parent_id: null,
        route_name: 'system-setting',
        menu_url: '/system-setting',
        menu_name: 'System Setting',
        menu_order: 2,
        menu_icon: 'SettingOutlined',
      },
      {
        parent_id: 2,
        route_name: 'users',
        menu_url: '/system-setting/users',
        menu_name: 'Users',
        menu_order: 1,
        menu_icon: 'UserOutlined',
      },
      {
        parent_id: 2,
        route_name: 'permissions',
        menu_url: '/system-setting/permissions',
        menu_name: 'Permissions',
        menu_order: 2,
        menu_icon: 'TagLock32Regular',
      },
      {
        parent_id: 2,
        route_name: 'roles',
        menu_url: '/system-setting/roles',
        menu_name: 'Roles',
        menu_order: 3,
        menu_icon: 'UnlockOutlined',
      },
      {
        parent_id: null,
        route_name: 'shops',
        menu_url: '/shops',
        menu_name: 'Shops',
        menu_order: 3,
        menu_icon: 'BarChartOutlined',
      },
      {
        parent_id: null,
        route_name: 'products',
        menu_url: '/products',
        menu_name: 'Products',
        menu_order: 4,
        menu_icon: 'DocumentSync24Regular',
      },
      {
        parent_id: 4,
        route_name: 'product-list',
        menu_url: '/list',
        menu_name: 'List',
        menu_order: 1,
        menu_icon: 'FileSyncOutlined',
      },
      {
        parent_id: 4,
        route_name: 'product-add',
        menu_url: '/add',
        menu_name: 'Add',
        menu_order: 2,
        menu_icon: 'DocumentArrowRight20Regular',
      },
      {
        parent_id: 4,
        route_name: 'attributes',
        menu_url: '/attributes',
        menu_name: 'Attributes',
        menu_order: 3,
        menu_icon: 'DocumentArrowRight20Regular',
      },
      {
        parent_id: 4,
        route_name: 'categories',
        menu_url: '/categories',
        menu_name: 'Categories',
        menu_order: 4,
        menu_icon: 'DocumentArrowRight20Regular',
      },
    ]);
  }
}
