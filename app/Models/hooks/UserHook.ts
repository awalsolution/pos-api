import User from "App/Models/User";
import crypto from "crypto";

interface UserHookContract {
  generateActivationCode: (userInstance: User) => void;
}

const UserHook: UserHookContract = {
  generateActivationCode: (userInstance) => {
    userInstance.activation_code = crypto.randomBytes(20).toString("hex");
    // userInstance.activationCodeExpiresAt = DateTime.now().plus({ days: 2 });
  },
};

export default UserHook;
