import { Response } from "express";
import { Chat } from "../Models/Chat";
import { ISaveMessage } from "../Types/IChats";
import { IAuthenticatedRequest } from "../Types/IAuthMiddleware";

export class MessageController {
  static async saveMessage(req: IAuthenticatedRequest, res: Response) {
    try {
      let data = req.body as ISaveMessage;
      data.sender_id = req.userId!;

      const responseMsg = await new Chat().saveMessage(data);
      return res.json(responseMsg);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao salvar mensagem", error });
    }
  }
}
