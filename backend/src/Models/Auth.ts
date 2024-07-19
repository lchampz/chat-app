import { IResponse } from './../Types/IResponse';
import { prisma } from "./Prisma";
import { IUser, ISignIn } from "../Types/IUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../Types/IJwtPayload";

const SECRET = process.env.SECRET as string;

export class Auth {
  async signIn(user: ISignIn): Promise<IResponse> {
    const findedEmail = await prisma.users.findFirst({where: {email: user.email}});

    if(!findedEmail) return { message: "Email ou senha incorretos.", status: false };

    const verifyPass = await bcrypt.compare(user.password, findedEmail.password);

    if (!verifyPass)
      return { message: "Email ou senha incorretos.", status: false };
    
    const token = jwt.sign({id: findedEmail.id }, SECRET, {expiresIn: '8h'});
    
    const date = new Date()

    await prisma.users.update({where: {email: findedEmail.email}, data: {last_login: date.toISOString()}})

    return {message: "Login efetuado.", status: true, token: token};
  }

  async signUp(user: IUser): Promise<IResponse> {
    const userExists = await prisma.users.findFirst({
      where: {
        email: user.email,
      },
    });

    if (userExists) return { message: "Email já utilizado.", status: false };

    const hashPassword = await bcrypt.hash(user.password, 10);

    const newUser = await prisma.users.create({
      data: {
        avatar: user.avatar,
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    });

    if(newUser) return {message: "Usuário cadastrado com sucesso.", status: true}
    else return {message: "Erro ao cadastrar usuário.", status: false}
  }

  parseTokenToId(token: string): IResponse {
      try {
        const { id } = jwt.verify(
          token,
          process.env.SECRET as string
        ) as IJwtPayload;
       
        return {status: true, message: id};
      } catch (error) {
        return { status: false, message: "Token Expirado" };
      }
  }
}

