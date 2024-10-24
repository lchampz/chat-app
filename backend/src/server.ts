import express, { Application } from "express";
import http from "http";
import path from "path";
import authRoutes from "./Routes/auth.routes";
import userRoutes from "./Routes/user.routes";
import chatRoutes from "./Routes/chat.routes";
import messageRoutes from "./Routes/message.routes";
import { Socket } from "./Models/Socket";

class App {
  private PORT: number;
  private app: Application;
  private http: http.Server;
  private clsSocket: Socket;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.PORT = 8000;
    this.http = http.createServer(this.app);
    this.clsSocket = new Socket(this.http);

    this.setupRoutes();
  }

  listenServer() {
    this.http.listen(this.PORT, () => {
      console.log(`Server running on http://localhost:${this.PORT}`);
    });
  }

  setupRoutes() {
    
    this.app.use("/auth", authRoutes);
    this.app.use("/users", userRoutes);
    this.app.use("/chats", chatRoutes);
    this.app.use("/messages", messageRoutes);

    
    this.app.get("/", (req, res) => {
      res.sendFile(path.resolve(__dirname + "../../../test/index.html"));
    });
  }
}

const app = new App();
app.listenServer();
