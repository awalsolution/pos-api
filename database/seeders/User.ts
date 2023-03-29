import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";
import UserProfile from "App/Models/UserProfile";

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: "owner@gmail.com",
        password: "123456",
        phone: "12345678",
      },
      {
        email: "user@gmail.com",
        password: "123456",
        phone: "12345679",
      },
    ]);
    await UserProfile.createMany([
      {
        userId: 1,
        first_name: "owner",
        last_name: "app",
        phone_number: "123456789",
        address: "Lahore",
        city: "Lahore",
        state: "Punjab",
        country: "Pakistan",
      },
      {
        userId: 2,
        first_name: "user",
        last_name: "app",
        phone_number: "123456789",
        address: "Lahore",
        city: "Lahore",
        state: "Punjab",
        country: "Pakistan",
      },
    ]);
  }
}
