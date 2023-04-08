import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";
// import UserProfile from "App/Models/UserProfile";

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: "owner@gmail.com",
        password: "123456",
        phone_number: "12345678",
        userType: "super admin",
      },
      {
        email: "user@gmail.com",
        password: "123456",
        phone_number: "12345679",
        userType: "vendor",
      },
    ]);
    // await UserProfile.createMany([
    //   {
    //     userId: 1,
    //     first_name: "owner",
    //     last_name: "app",
    //     address: "Lahore",
    //     city: "Lahore",
    //     state: "Punjab",
    //     country: "Pakistan",
    //   },
    //   {
    //     userId: 2,
    //     first_name: "user",
    //     last_name: "app",
    //     address: "Lahore",
    //     city: "Lahore",
    //     state: "Punjab",
    //     country: "Pakistan",
    //   },
    // ]);
  }
}
