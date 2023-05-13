import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'iqbal@gmail.com',
        password: '123456',
        userType: 'super admin',
      },
      {
        email: 'admin@gmail.com',
        password: '123456',
        userType: 'admin',
      },
      {
        email: 'vendor@gmail.com',
        password: '123456',
        userType: 'vendor',
      },
    ]);
  }
}
