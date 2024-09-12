import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Profile from '#models/profile'

export default class extends BaseSeeder {
  async run() {
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
        profile_picture: '/uploads/xy95h397wb9mrq1dhhvncl1n.webp',
      },
      {
        userId: 2,
        first_name: 'Jawad',
        last_name: 'Ali',
        phone_number: '12345678',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        profile_picture: '/uploads/xy95h397wb9mrq1dhhvncl1n.webp',
      },
    ])
  }
}
