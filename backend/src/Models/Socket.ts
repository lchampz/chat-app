import http from "http";
import { Server, Socket as SocketIO } from "socket.io";
interface IMessage {
  id: string;
  msg: string;
}

export class Socket {
  io: Server;
  isOn: boolean = false;
  usersConnected: string[] = [];

  constructor(http: http.Server) {
    this.io = new Server(http);
    this.io.on("connection", (socket: SocketIO) => {
      console.log(`Conectado: ${socket.id}`);
      this.addUser(socket.id);
      this.handleMessage(socket);
      
      socket.on("disconnect", () => {
        this.removeUser(socket.id);
        console.log(`Desconectado: ${socket.id}`);
      });
    });
  }

  
  handleMessage(socket: SocketIO) {
    socket.on("message", (msg: string) => {
      const message: IMessage = { id: socket.id, msg };
      socket.broadcast.emit("message", message);
    });
  }

  
  addUser(userId: string) {
    this.usersConnected.push(userId);
  }

  removeUser(userId: string) {
    this.usersConnected = this.usersConnected.filter((id) => id !== userId);
  }
}
