"use strict";
import User from "App/Models/User";
import { UserOptions } from "./types/user_types";
export default class UserServices {
  protected email: string | undefined;
  protected id: number | undefined;
  protected user: User | null;

  constructor(userOptions?: UserOptions) {
    if (userOptions) {
      const { email, id } = userOptions;
      if (email && id)
        throw new Error(
          "You should not supply both `email` and `id` at the same time."
        );
      if (!email && !id)
        throw new Error(
          "The userOptions object should have either email or id property."
        );
      this.email = email;
      this.id = id;
    }

    this.user = null;
  }

  public async getUserModel(): Promise<User> {
    try {
      let user: User;
      if (this.email) {
        user = await User.findByOrFail("email", this.email);
      } else if (this.id) {
        user = await User.findOrFail(this.id);
      }

      if (user! && !this.id) {
        this.id = user.id;
        this.user = user;
      }
      return user!;
    } catch (error) {
      throw new Error("User not found");
    }
  }
}
