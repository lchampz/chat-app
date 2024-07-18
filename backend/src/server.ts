
import http from 'http'
import express, { Application } from 'express'
import { Server } from "socket.io";
import path from 'path';

class App {
    private PORT: number;
    private app: Application;
    private http: http.Server; 
    private io: Server;
    constructor() {
        this.app = express();
        this.PORT = 3000;
        this.http = http.createServer(this.app)
        this.io = new Server(this.http)
        this.listenSocket();
        this.setupRoutes();
    }

    listenServer() {
        this.http.listen(this.PORT, () => console.log(`Server running on http://localhost:${this.PORT}`))  
    }

    listenSocket() {
        this.io.on('connection', (socket) => {
            console.log("user connected: ",socket.id);

            socket.on("message", (msg) => {
                this.io.emit('message', {id: socket.id, msg: msg});
            })
        });
    }

    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(path.resolve(__dirname + "../../../frontend/index.html"))
        })
    }
}

const app = new App();

app.listenServer();
