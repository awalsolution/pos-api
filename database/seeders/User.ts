import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        shopId: 1,
        email: 'iqbal@gmail.com',
        password: '123456',
        userType: 'super admin',
      },
      {
        shopId: 1,
        email: 'admin@gmail.com',
        password: '123456',
        userType: 'admin',
      },
      {
        shopId: 3,
        email: 'vendor@gmail.com',
        password: '123456',
        userType: 'vendor',
      },
    ]);
  }
}
