
import { prisma } from "./Prisma";
import { ISanitizeUser } from "../Types/IUser";
import { Auth } from "./Auth";

export class User extends Auth {
  async getUserInfo(id: string): Promise<ISanitizeUser | null> {
    const user = await prisma.users.findFirst({
      omit: {
        password: true,
      },
      where: { id: id },
    });
    return user;
  }
}
