import mongoose from "mongoose";

export interface IOrderItem {
  uuid: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  size: string;
}

export interface Order {
  uuid: string;
  restaurantId: string;
  customerId: string;
  order: {
    customerName: string;
    items: IOrderItem[];
    total: number;
    address: string;
  };
  status:
    | "PENDIENTE"
    | "ENTREGADO"
    | "EN ESPERA"
    | "EN PREPARACION"
    | "CANCELADO"
    | "RETRASADO"
    | "EN CAMINO";
  createdAt: Date;
}

export const OrderMongoSchema = new mongoose.Schema<Order>(
  {
    uuid: {
      type: String,
      unique: true,
      default: () => crypto.randomUUID(),
    },
    restaurantId: { type: String, required: true },
    customerId: { type: String, required: true },
    order: {
      customerName: { type: String, required: true },
      items: [
        {
          uuid: { type: String, required: true },
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
          description: { type: String, required: true },
          size: { type: String, required: true },
        },
      ],
      total: { type: Number, required: true },
      address: { type: String, required: true },
    },
    status: {
      type: String,
      enum: [
        "PENDIENTE",
        "ENTREGADO",
        "EN ESPERA",
        "EN PREPARACION",
        "CANCELADO",
        "RETRASADO",
      ],
      default: "PENDIENTE",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
