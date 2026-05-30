import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required !"],
    },
    image: {
      type: Array,
      default: [],
    },

    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],

    sub_category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "sub_category",
      },
    ],

    unit: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: null,
    },

    price: {
      type: Number,
      default: null,
    },

    discount: {
      type: Number,
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    more_details: {
      type: Object,
      default: {},
    },

    publish: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
