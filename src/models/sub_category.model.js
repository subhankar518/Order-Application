import mongoose from "mongoose";

const sub_category_schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sub-Category name is required !"],
    },
    image: {
      type: String,
      default: "",
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const sub_category = mongoose.model("sub_category", sub_category_schema);
