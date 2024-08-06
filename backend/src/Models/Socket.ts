import http from "http";
import { Server } from "socket.io";

export class Socket {
    io: Server;
    isOn: boolean;
    usersConnected: string[] = [];
    constructor(http: http.Server) {
      this.io = new Server(http);
      this.isOn = true;
    }
}