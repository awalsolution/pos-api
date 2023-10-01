import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        shopId: undefined,
        email: 'iqbal@gmail.com',
        password: '123456',
      },
      {
        shopId: undefined,
        email: 'admin@gmail.com',
        password: '123456',
      },
      {
        shopId: 1,
        email: 'shop1admin@gmail.com',
        password: '123456',
      },
      {
        shopId: 1,
        email: 'shop1user1@gmail.com',
        password: '123456',
      },
      {
        shopId: 1,
        email: 'shop1user2@gmail.com',
        password: '123456',
      },
      {
        shopId: 2,
        email: 'shop2admin@gmail.com',
        password: '123456',
      },
      {
        shopId: 2,
        email: 'shop2user1@gmail.com',
        password: '123456',
      },
      {
        shopId: 2,
        email: 'shop2user2@gmail.com',
        password: '123456',
      },
      {
        shopId: 3,
        email: 'shop3admin@gmail.com',
        password: '123456',
      },
      {
        shopId: 3,
        email: 'shop3user1@gmail.com',
        password: '123456',
      },
      {
        shopId: 3,
        email: 'shop3user2@gmail.com',
        password: '123456',
      },
    ]);
  }
}
