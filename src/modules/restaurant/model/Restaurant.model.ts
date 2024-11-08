import mongoose from "mongoose";
import crypto from "node:crypto";
import { validatePassword, passwordHash } from "../../authentication/helpers";
import { Customer } from "@/config/entities";

const UserMongoSchema = new mongoose.Schema<Customer>(
  {
    uuid: {
      type: String,
      unique: true,
      default: () => crypto.randomUUID(),
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    rol: {
      type: String,
      required: true,
    },
    address: [
      {
        addressLine1: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);