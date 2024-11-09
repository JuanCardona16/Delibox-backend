import mongoose from "mongoose";
import { setError } from "@/helpers";
import { Restaurant } from "@/config/entities";

const RestaurantMongoSchema = new mongoose.Schema<Restaurant>(
  {
    uuid: {
      type: String,
      unique: true,
      default: () => crypto.randomUUID(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    adminId: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    menuId: {
      type: String,
      trim: true
    },
    operatingHours: {
      type: String,
      required: true,
      trim: true
    }

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default RestaurantMongoSchema;
