import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        name: 'Iqbal Hassan',
        email: 'admin@gmail.com',
        phone_number: '12345678',
        password: 'admin@123',
        is_email_verified: 1,
        email_verified_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        is_phone_verified: 1,
        phone_verified_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        created_by: 'Iqbal Hassan',
        profile_picture: '/uploads/admin/dev.jpg',
      },
    ])
  }
}
