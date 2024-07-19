import http from "http";
import express, { Application } from "express";
import { Server } from "socket.io";
import path from "path";
import { Auth } from "./Models/Auth";
import { User } from "./Models/User";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "./Types/IJwtPayload";
class App {
  private PORT: number;
  private app: Application;
  private http: http.Server;
  private io: Server;
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.PORT = 3000;
    this.http = http.createServer(this.app);
    this.io = new Server(this.http);
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
      console.log("user connected: ", socket.id);

      socket.on("message", (msg) => {
        this.io.emit("message", { id: socket.id, msg: msg });
      });
    });
  }

  setupRoutes() {
    this.app.get("/", (req, res) => {
      res.sendFile(path.resolve(__dirname + "../../../frontend/index.html"));
    });
    this.app.post("/signUp", async (req: any, res: any) => {
      console.log(req.body);
      const { avatar, password, name, email } = req.body;

      const response = await new Auth().signUp({
        avatar,
        password,
        name,
        email,
      });

      res.json(response);
    });
    this.app.post("/signIn", async (req, res) => {
      const { email, password } = req.body;

      const response = await new Auth().signIn({ email, password });

      res.json(response);
    });
    this.app.get("/user", async (req, res) => {
      const { authorization } = req.headers;

      if (!authorization)
        return res.status(401).json({ msg: "Não autorizado" });

      const token = authorization.split(" ")[1];

      const response = new Auth().parseTokenToId(token);
      if(!response.status) return res.status(401).json({ message: response.message });

      const user = await new User().getUserInfo(response.message!);
        
      if (!user) return res.status(401).json({ msg: "Não autorizado" });

      return res.json(user);
      
    });
  }
}

const app = new App();

app.listenServer();
