import mongoose, { Schema } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  items: IOrderItem[];
  total: number;
  status: "PENDING" | "PREPARING" | "DELIVERED" | "CANCELLED";
  userId: string;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "PREPARING", "DELIVERED", "CANCELLED"],
    default: "PENDING",
  },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
