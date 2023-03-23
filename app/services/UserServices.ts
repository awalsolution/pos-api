"use strict";
import User from "App/Models/User";
import { UserFullDetails, UserOptions } from "./types/user_types";
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

  // user with profile
  public async get_user_full_profile(): Promise<UserFullDetails> {
    let userDetails: UserFullDetails | null = null;

    const user = await User.query()
      .preload("roles", (roleQuery) => roleQuery.select("name", "id"))
      .preload("user_profile_relation", (profileQuery) => {
        profileQuery.preload("profile_picture_file", (fileQuery) =>
          fileQuery.select("formats", "url")
        );
        profileQuery.select(
          "first_name",
          "last_name",
          "profile_picture",
          "phone_number",
          "address",
          "city",
          "zipcode",
          "state",
          "country",
          "created_at",
          "updated_at"
        );
      })
      .where("id", this.id!)
      .first();

    const serialisedUserDetails = user?.serialize();

    userDetails = serialisedUserDetails as UserFullDetails;

    return userDetails!;
  }
}
