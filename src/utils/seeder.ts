import { IAuthProvider, IUser, Role } from "../app/modules/user/user.interface";
import { User } from "../app/modules/user/user.model";
import { envVars } from "../configs/env";
import bcrypt from "bcryptjs";
export const superAdminSeeder = async () => {
  try {
    const isAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isAdminExist) {
      return console.log("super admin already exist");
    }

    const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASS, 10);

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: Partial<IUser> = {
      name: "Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      auths: [authProvider],
    };

    const user = await User.create(payload);

    console.log("super created successfully");
  } catch (error) {
    console.log(error);
  }
};
