import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
// import User from 'App/Models/User';
import Profile from 'App/Models/Profile';

export default class extends BaseSeeder {
  public async run() {
    await Profile.createMany([
      {
        userId: 1,
        first_name: 'Iqbal',
        last_name: 'Hassan',
        phone_number: '12345678',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        profile_picture: null,
      },
      {
        userId: 2,
        first_name: 'Jawad',
        last_name: 'ali',
        phone_number: '12345678',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        profile_picture: null,
      },
      {
        userId: 3,
        first_name: 'vendor',
        last_name: '1',
        phone_number: '12345678',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        profile_picture: null,
      },
    ]);
  }
}
