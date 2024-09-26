import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'admin@gmail.com',
        password: 'admin@123',
        created_by: 'Iqbal Hassan',
        name: 'Iqbal Hassan',
        phone_number: '12345678',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        profile_picture: '/uploads/admin/dev.jpg',
      },
      {
        email: 'manager@gmail.com',
        password: 'admin@123',
        created_by: 'Iqbal Hassan',
        name: 'Jawad Ali',
        phone_number: '12345678',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        profile_picture: '/uploads/admin/dev.jpg',
      },
    ])
  }
}
