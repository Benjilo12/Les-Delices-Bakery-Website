// models/product.model.js
import mongoose from "mongoose";

const PriceOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: [
        "Birthday Cakes",
        "Wedding Cakes",
        "Cupcakes",
        "Cake Loaves",
        "Pastries & Snacks",
      ],
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    priceOptions: [PriceOptionSchema],
    customizationAvailable: {
      type: Boolean,
      default: false,
    },
    customizationNotes: {
      type: String,
    },
    availableFlavors: [
      {
        type: String,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ FIXED: Use mongoose.models, not undefined "models"
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
