import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Profile from '#models/profile'

export default class extends BaseSeeder {
  async run() {
    await Profile.createMany([
      {
        userId: 1,
        name: 'Iqbal Hassan',
        phone_number: '12345678',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        profile_picture: '/uploads/xy95h397wb9mrq1dhhvncl1n.webp',
      },
      {
        userId: 2,
        name: 'Jawad Ali',
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
