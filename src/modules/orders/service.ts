import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { OrderMongoSchema, IOrderItem, Order } from "./models";
import { getModel } from "@/config/database";
import { Collection } from "@/config/constants";

class SocketService {
  private io: SocketIOServer | null = null;

  initialize(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: [
          "http://localhost:5173",
          "http://localhost:5174",
          "https://delibox-client.onrender.com",
          "https://delibox-admin.onrender.com",
          "https://delibox-client.vercel.app",
          "https://delibox-admin.vercel.app",
        ],
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log("Client connected: ", socket.id);
      socket.emit("hola", "¡Bienvenido al servidor!");

      socket.on("joinRestaurant", (restaurantId: string) => {
        socket.join(restaurantId);
        console.log(`Socket ${socket.id} joined room ${restaurantId}`);
      });

      // Escuchar nuevo pedido
      socket.on("newOrder", async (order, callback) => {
        console.log("Received order: ", order);

        const { restaurantId } = order;

        if (restaurantId) {
          try {
            const orderModel = getModel<Order>(
              Collection.ORDERS,
              OrderMongoSchema
            );

            if (!orderModel) {
              this.io?.to(restaurantId).emit("Error", {
                status: "CANCELADO",
                message: "Hubo un problema inesperado",
              });
            }

            // Guardar el pedido en la base de datos
            const newOrder = new orderModel({
              ...order,
              status: "PENDIENTE", // Estado inicial del pedido
            });

            await newOrder.save();

            this.io?.to(restaurantId).emit("orderReceived", order);

            console.log(`Order emitted to room ${restaurantId}`);

            // Responder al cliente que envió el pedido
            callback({
              status: "ok",
              message: "Pedido recibido correctamente",
              orderId: newOrder.uuid,
            });
          } catch (error) {
            console.error("Error saving order: ", error);
            callback({
              status: "error",
              message: "Error al guardar el pedido",
            });
          }
        } else {
          callback({ status: "error", message: "restaurantId es obligatorio" });
        }
      });
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
