import { Chats, Messages } from "@prisma/client";
import { prisma } from "./Prisma";

export class Chat {
  async getChats(id: string): Promise<Chats[] | null> {
    return await prisma.chats.findMany({
      where: { OR: [{ receiver_id: id }, { sender_id: id }] },
    });
  }

  async getChatById(id: string): Promise<Messages[] | null> {
    return await prisma.messages.findMany({ where: { chat_id: id } });
  }

  async userHasPermission(
    idUser: string,
    idChat: string
  ): Promise<boolean> {
    const chats = await prisma.chats.findMany({
      where: {
        OR: [{ receiver_id: idUser }, { sender_id: idUser }],
        AND: [{ id: idChat }],
      },
    });

    if(chats.length <= 0 || !chats) return false;
    else return true;
  }
}
