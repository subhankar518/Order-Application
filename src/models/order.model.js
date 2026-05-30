import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, "OrderId is required !"],
      unique: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    product_details: {
      name: String,
      image: Array,
    },

    paymentId: {
      type: String,
      default: "",
    },

    // need enum
    payment_status: {
      type: String,
      default: "",
    },

    addressId: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
    },

    subTotalAmt: {
      type: Number,
      default: 0,
    },

    totalAmt: {
      type: Number,
      default: 0,
    },

    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model("Order", orderSchema);
