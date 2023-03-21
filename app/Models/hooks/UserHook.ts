// import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";
import crypto from "crypto";

interface UserHookContract {
  hashPassword: (userInstance: User) => void;
  generateActivationCode: (userInstance: User) => void;
}

const UserHook: UserHookContract = {
  /**
   * Hash password for the User Instance
   * @param {object} userInstance - The color, in hexadecimal format.
   * @function UserHook.hashPassword
   * @return null
   */
  hashPassword: async (userInstance) => {
    try {
      if (userInstance.$dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    } catch (error) {
      console.log(error);
    }
  },

  generateActivationCode: (userInstance) => {
    userInstance.activation_code = crypto.randomBytes(20).toString("hex");
    // userInstance.activationCodeExpiresAt = DateTime.now().plus({ days: 2 });
  },
};

export default UserHook;
