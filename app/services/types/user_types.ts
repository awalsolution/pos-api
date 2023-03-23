import User from "App/Models/User";

export interface UserOptions {
  email?: User["email"];
  id?: User["id"];
}

export interface UserFullDetails {
  id: string;
  email: string;
  role_id: string;
  activation_code: number | null;
  forgot_password_code: number | null;
  is_account_activated: boolean;
  is_email_verified: boolean;
  account_activated_at: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role: {
    id: string;
    name: string;
  };
  profile: {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    profile_picture: string | null;
    phone_number: string;
    address: string;
    city: string;
    created_at: string;
    updated_at: string;
    country: string;
    state: string | null;
  };
}
