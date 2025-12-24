import mongoose, { Schema } from "mongoose";

const PriceOptionSchema = new Schema(
  {
    label: { type: String, required: true },
    //e.g " 6 Inch-1 Flavor", "12 pieces - Flavors"

    price: { type: Number, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema(
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
      enum: ["Birthday Cakes", "Cupcakes", "Cake Loaves", "Pastries & Snacks"],
      required: true,
    },

    description: {
      type: String,
    },

    images: [
      {
        type: String, // Cloudinary / ImageKit URL
      },
    ],

    priceOptions: [PriceOptionSchema],

    customizationAvailable: {
      type: Boolean,
      default: false,
    },

    customizationNotes: {
      type: String,
      // e.g. "Character cakes, edible prints, toppers"
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

export default models.Product || mongoose.model("Product", ProductSchema);
