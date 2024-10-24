import { Request, Response } from "express";
import { User } from "../Models/User";

export class AuthController {
  static async signUp(req: Request, res: Response) {
    try {
      const { avatar, password, name, email } = req.body;
      const response = await new User().signUp({ avatar, password, name, email });
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar usuário", error });
    }
  }

  static async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    const response = await new User().signIn({ email, password });
    return res.json(response);
  }
}
