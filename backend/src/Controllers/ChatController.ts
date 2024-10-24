import { Response } from "express";
import { Chat } from "../Models/Chat";
import { IAuthenticatedRequest } from "../Types/IAuthMiddleware";

export class ChatController {
  static async getChats(req: IAuthenticatedRequest, res: Response) {
    try {
      const chats = await new Chat().getChats(req.userId!);
      if (!chats?.chats || chats.chats.length === 0) {
        return res.status(404).json({ msg: "Nenhum chat encontrado." });
      }
      return res.json(chats);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao obter chats", error });
    }
  }

  static async getChatById(req: IAuthenticatedRequest, res: Response) {
    try {
      const chatId = req.params.chatId;
      const clsChat = new Chat();
      const hasPermission = await clsChat.userHasPermission(req.userId!, chatId);

      if (!hasPermission) {
        return res.status(401).json({ msg: "Não autorizado" });
      }

      const chats = await clsChat.getChatById(chatId);
      if (!chats || chats.length == 0) {
        return res.status(404).json({ msg: "Nenhuma mensagem encontrada." });
      }

      return res.json(chats);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao obter chat", error });
    }
  }

  static async createChat(req: IAuthenticatedRequest, res: Response) {
    try {
      const { email } = req.body;
      const clsChat = new Chat();

      const creationStatus = await clsChat.createNewChat({
        sender: req.userId!,
        receiver: email,
      });

      return res.json(creationStatus);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar chat", error });
    }
  }

  static async deleteChat(req: IAuthenticatedRequest, res: Response) {
    try {
      const chatId = req.params.chatId;
      const responseChat = await new Chat().deleteChat(chatId);
      return res.json(responseChat);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar chat", error });
    }
  }
}
