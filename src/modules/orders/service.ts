import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { IOrder, IOrderItem, Order } from "./models";

class SocketService {
  private io: SocketIOServer | null = null;

  initialize(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log("Client connected");
      socket.emit("hola", "¡Bienvenido al servidor!")

      socket.on(
        "hola",
        async (data) => {
          try {
            console.log(data)
            this.io?.emit("Hola, ¿Como estas?")
          } catch (error) {
            socket.emit("orderError", error);
          }
        }
      );
    });
  }

  getIO() {
    if (!this.io) {
      throw new Error("Socket.IO not initialized");
    }
    return this.io;
  }
}

export default new SocketService();
