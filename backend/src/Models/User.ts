
import { prisma } from "./Prisma";
import { ISanitizeUser } from "../Types/IUser";

export class User {
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
