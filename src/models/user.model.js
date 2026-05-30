import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required !"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required !"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required !"],
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: Number,
      default: null,
    },

    refreshToken: {
      type: String,
      default: "",
    },

    verify_email: {
      type: Boolean,
      default: false,
    },

    last_login_date: {
      type: Date,
      default: "",
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },

    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Address",
      },
    ],

    shoping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "cart_product",
      },
    ],

    order_history: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
      },
    ],

    forgot_password_otp: {
      type: String,
      default: null,
    },

    forgot_password_expiry: {
      type: Date,
      default: "",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
