import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required !"],
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model("Category", categorySchema);
