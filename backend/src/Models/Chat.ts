import { Chats, Messages } from "@prisma/client";
import { prisma } from "./Prisma";
import { IResponse } from "../Types/IResponse";
import { IChat, INewChat, ISaveMessage } from "../Types/IChats";

export class Chat {
  async getChats(id: string): Promise<IChat | null> {
    const chats = await prisma.chats.findMany({
      include: {
        messages: {
          select: {
            id: true,
            body: true,
            sender_id: true,
            created_at: true,
            viewed_at: true,
          },
        },
      },
      where: { OR: [{ receiver_id: id }, { sender_id: id }] },
    });

    const unseen_count = chats.reduce((count, chat) => {
      return count + chat.messages.reduce((msgCount, msg) => {
        return (id !== msg.sender_id && !msg.viewed_at) ? msgCount + 1 : msgCount;
      }, 0);
    }, 0);
    
    return { chats, unseen_count };
  }

  async getChatById(id: string): Promise<Messages[] | null> {
    return await prisma.messages.findMany({ where: { chat_id: id } });
  }

  async userHasPermission(idUser: string, idChat: string): Promise<boolean> {
    const chats = await prisma.chats.findMany({
      where: {
        OR: [{ receiver_id: idUser }, { sender_id: idUser }],
        AND: [{ id: idChat }],
      },
    });

    if (chats.length <= 0 || !chats) return false;
    else return true;
  }

  async getIdFromEmail(email: string): Promise<string | null> {
    const user = await prisma.users.findUnique({ where: { email: email } });
    return user?.id ?? null;
  }

  async createNewChat(body: INewChat): Promise<IResponse> {
    const receiverId = await this.getIdFromEmail(body.receiver);

    if (!receiverId)
      return {
        status: false,
        message: "Email não pertence a nenhum usuário cadastrado.",
      };

    const isChatExists = await prisma.chats.findFirst({
      where: {
        OR: [
          { AND: [{ receiver_id: receiverId }, { sender_id: body.sender }] },
          { AND: [{ receiver_id: body.sender }, { sender_id: receiverId }] },
        ],
      },
    });

    if (isChatExists) return { status: false, message: isChatExists.id };

    const newChat = await prisma.chats.create({
      data: {
        created_at: new Date().toISOString(),
        receiver_id: receiverId,
        sender_id: body.sender!,
      },
    });

    if (newChat) return { message: newChat.id, status: true };
    return { message: "Erro ao criar chat.", status: false };
  }

  async deleteChat(chatId: string): Promise<IResponse> {
    const responseMessages = await this.deleteAllMessages(chatId);

    if (responseMessages.status) {
      const chatDeleted = await prisma.chats.delete({ where: { id: chatId } });

      if (chatDeleted)
        return { status: true, message: "Chat excluído com sucesso." };
    }

    return { status: false, message: responseMessages.message };
  }

  async deleteAllMessages(chatId: string): Promise<IResponse> {
    const isChatExists = await prisma.chats.findFirst({
      where: {
        id: chatId,
      },
    });

    if (!isChatExists) return { status: false, message: "Chat não existe." };

    const { count } = await prisma.messages.deleteMany({
      where: { chat_id: chatId },
    });

    return { status: true, message: `Foram excluídas ${count} mensagens.` };
  }

  async saveMessage(message: ISaveMessage): Promise<IResponse> {
    const responseMsg = await prisma.messages.create({
      data: {
        body: message.body,
        attachment_code: message.attachment_code,
        created_at: new Date().toISOString(),
        chat_id: message.chat_id,
        sender_id: message.sender_id,
      },
    });

    if (responseMsg)
      return { status: true, message: "Mensagem registrada com sucesso." };

    return { status: false, message: "Erro ao registrar mensagem." };
  }
}
