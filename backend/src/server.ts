import http from "http";
import express, { Application } from "express";
import { Server } from "socket.io";
import path from "path";
import { User } from "./Models/User";
import { Chat } from "./Models/Chat";
import { Socket } from "./Models/Socket";
import { ISaveMessage } from "./Types/IChats";
class App {
  private PORT: number;
  private app: Application;
  private http: http.Server;
  private io: Server;
  private clsSocket: Socket;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.PORT = 8000;
    this.http = http.createServer(this.app);
    this.clsSocket = new Socket(this.http);
    this.io = this.clsSocket.io; 
    this.listenSocket();
    this.setupRoutes();
  }

  listenServer() {
    this.http.listen(this.PORT, () =>
      console.log(`Server running on http://localhost:${this.PORT}`)
    );
  }

  listenSocket() {
    this.io.on("connection", (socket) => {
      this.clsSocket.usersConnected.push(socket.id);

      //n sei oq fazer agr, nunca mexi com socket XD

      socket.on("message", (msg) => {
        this.io.emit("message", { id: socket.id, msg: msg });
      });
    });
    
  }

  setupRoutes() {
    this.app.post("/signUp", async (req: any, res: any) => {
      console.log(req.body);
      const { avatar, password, name, email } = req.body;

      const response = await new User().signUp({
        avatar,
        password,
        name,
        email,
      });

      res.json(response);
    });
    this.app.post("/signIn", async (req, res) => {
      const { email, password } = req.body;

      const response = await new User().signIn({ email, password });

      res.json(response);
    });
    this.app.get("/user", async (req, res) => {
      const { authorization } = req.headers;

      const clsUser = new User();

      if (!authorization)
        return res.status(401).json({ msg: "Não autorizado" });

      const token = authorization.split(" ")[1];

      const response = clsUser.parseTokenToId(token);
      if(!response.status) return res.status(401).json({ message: response.message });

      const user = await clsUser.getUserInfo(response.message!);
        
      if (!user) return res.status(401).json({ msg: "Não autorizado" });

      return res.json(user);
      
    });
    this.app.get("/chats", async (req, res) => {
      const { authorization } = req.headers;

      if (!authorization)
        return res.status(401).json({ msg: "Não autorizado" });

      const token = authorization.split(" ")[1];

      const response = new User().parseTokenToId(token);
      if(!response.status) return res.status(401).json({ message: response.message });

      const chats = await new Chat().getChats(response.message!);

      if(!chats?.chats || chats.chats.length == 0) return res.status(401).json({ msg: "Nenhum chat encontrado." });

      return res.json(chats);
    });
    this.app.get("/chat/:chatId", async (req, res) => {
      const chatId = req.params.chatId;
      const clsChat = new Chat();
      const { authorization } = req.headers;

      if (!authorization)
        return res.status(401).json({ msg: "Não autorizado" });

      const token = authorization.split(" ")[1];

      const response = new User().parseTokenToId(token);
      if(!response.status) return res.status(401).json({ message: response.message });

      const hasPermission = await clsChat.userHasPermission(response.message!, chatId);

      if(!hasPermission) return res.status(401).json({ msg: "Não autorizado" });

      const chats = await clsChat.getChatById(chatId);

      if(!chats || chats.length == 0) return res.status(401).json({ msg: "Nenhuma mensagem encontrada." });

      return res.json(chats);
    })
    this.app.post("/chat/create", async (req, res) => {
      const clsChat = new Chat();
      const { authorization } = req.headers;
      const { email } = req.body;

      if (!authorization)
        return res.status(401).json({ msg: "Não autorizado" });

      const token = authorization.split(" ")[1];

      const response = new User().parseTokenToId(token);
      if(!response.status) return res.status(401).json({ message: response.message });

      const creationStatus = await clsChat.createNewChat({sender: response.message!, receiver: email});

      return res.json(creationStatus);
    })
    this.app.delete("/chat/delete/:chatId", async (req, res) => {
      const { authorization } = req.headers;
      const chatId = req.params.chatId;

      if (!authorization)
        return res.status(401).json({ msg: "Não autorizado" });

      const token = authorization.split(" ")[1];

      const response = new User().parseTokenToId(token);
      if(!response.status) return res.status(401).json({ message: response.message });

      const responseChat = await new Chat().deleteChat(chatId);
      
      return res.json(responseChat);
    })
    this.app.post("/message/save", async (req, res) => {
      const { authorization } = req.headers;
      let data = req.body as ISaveMessage

      if (!authorization)
        return res.status(401).json({ msg: "Não autorizado" });

      const token = authorization.split(" ")[1];

      const response = new User().parseTokenToId(token);
      if(!response.status) return res.status(401).json({ message: response.message });

      data.sender_id = response.message!;

      const responseMsg = await new Chat().saveMessage(data);

      return res.json(responseMsg);
    })
  }
}

const app = new App();

app.listenServer();
