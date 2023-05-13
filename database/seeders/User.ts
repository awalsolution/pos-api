import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';
// import UserProfile from "App/Models/UserProfile";

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'iqbal@gmail.com',
        password: '123456',
        phone_number: '12345678',
        userType: 'super admin',
      },
      {
        email: 'admin@gmail.com',
        password: '123456',
        phone_number: '12345679',
        userType: 'admin',
      },
      {
        email: 'vendor@gmail.com',
        password: '123456',
        phone_number: '12345679',
        userType: 'vendor',
      },
    ]);
  }
}
