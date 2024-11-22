import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { IOrder, IOrderItem, Order } from "./models";

class SocketService {
  private io: SocketIOServer | null = null;

  initialize(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log("Client connected: ", socket.id);
      socket.emit("hola", "¡Bienvenido al servidor!")

      socket.on("joinRestaurant", (restaurantId: string) => {
        socket.join(restaurantId);
        console.log(`Socket ${socket.id} joined room ${restaurantId}`)
      })

      // Escuchar nuevo pedido
      socket.on("newOrder", (order, callback) => {
        console.log("Received order: ", order)

        const { restaurantId } = order;
        if (restaurantId) {
          this.io?.to(restaurantId).emit("orderReceived", order)
          console.log(`Order emitted to room ${restaurantId}`)
          callback({ status: "ok", message: "Pedido recibido correctamente" })
        }

      })
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
