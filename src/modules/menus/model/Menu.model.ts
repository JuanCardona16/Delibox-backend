import mongoose from "mongoose";
import { Menu } from "@/config/entities";

const MenuMongoSchema = new mongoose.Schema<Menu>(
  {
    uuid: {
      type: String,
      unique: true,
      default: () => crypto.randomUUID(),
    },
    restaurantUuid: {
      type: String,
      required: true,
      trim: true,
    },
    products: [
      {
        uuid: {
          type: String,
          unique: true,
          default: () => crypto.randomUUID(),
        },
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        category: {
          type: String, // Puedes cambiar esto a un ObjectId si quieres hacer referencia a un modelo 'Category'
          required: true,
        },
        size: {
          type: String,
          required: false, // Este campo es opcional
        },
        isAvailable: {
          type: Boolean,
          required: true,
        },
        estimatedPreparatiTime: {
          type: String,
          required: true,
        },
        // options: [
        //   {
        //     name: {
        //       type: String,
        //       required: true,
        //     },
        //     additionalCost: {
        //       type: Number,
        //       required: true,
        //     },
        //   },
        // ],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default MenuMongoSchema;
