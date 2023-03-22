import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Role from "App/Models/Role";

export default class extends BaseSeeder {
  public async run() {
    await Role.createMany([
      {
        name: "onwer",
        description: "Application Onwer has full permissions",
      },
      {
        name: "user",
        description: "this one is simple customer",
      },
    ]);
  }
}
