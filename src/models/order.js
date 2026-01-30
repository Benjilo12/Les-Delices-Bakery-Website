// models/order.js
import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    selectedOption: {
      label: { type: String, required: true },
      price: { type: Number, required: true },
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    selectedFlavors: [
      {
        type: String,
      },
    ],
    customization: {
      requested: { type: Boolean, default: false },
      details: { type: String },
      additionalCost: { type: Number, default: 0 },
    },
    itemTotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Customer Information (from Clerk)
    userId: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },

    // Order Items
    items: [OrderItemSchema],

    // Pricing
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // Delivery Details
    deliveryMethod: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },
    deliveryAddress: {
      street: String,
      area: String,
      city: { type: String, default: "Accra" },
      additionalInfo: String,
    },

    // Event Details
    eventDate: {
      type: Date,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["Birthday", "Anniversary", "Wedding", "Corporate", "Other"],
      default: "Birthday",
    },
    specialInstructions: {
      type: String,
    },

    // Order Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in-progress",
        "ready",
        "out-for-delivery",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    // Payment
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "mobile-money", "bank-transfer", "card"],
    },
    paymentReference: {
      type: String,
    },

    // Admin Notes
    adminNotes: {
      type: String,
    },

    // Timestamps for status changes
    confirmedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
OrderSchema.pre("save", function (next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
      
      // Generate a simple timestamp-based order number for now
      // In production, you should use a counter but this will work for testing
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      this.orderNumber = `LD-${dateStr}-${timestamp}${random}`;
      console.log("Generated order number:", this.orderNumber);
    } catch (error) {
      console.error("Error generating order number:", error);
      // Fallback order number
      this.orderNumber = `LD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);