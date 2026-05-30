import mongoose from "mongoose";

const cart_product_schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

export const cart_product = mongoose.model("cart_product", cart_product_schema);
