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
      label: { type: String, required: true }, // e.g., "8 Inch - 2 Flavors"
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
      details: { type: String }, // Customer's customization requests
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
      // Generate format: LD-YYYYMMDD-XXXX
    },

    // Customer Information (from Clerk)
    userId: {
      type: String, // Clerk User ID
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
    },
    specialInstructions: {
      type: String,
    },

    // Order Status
    status: {
      type: String,
      enum: [
        "pending", // Order placed, awaiting confirmation
        "confirmed", // Order confirmed by bakery
        "in-progress", // Being prepared
        "ready", // Ready for pickup/delivery
        "out-for-delivery", // Out for delivery
        "completed", // Order fulfilled
        "cancelled", // Order cancelled
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
    timestamps: true, // createdAt, updatedAt
  }
);

// Index for efficient queries
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ eventDate: 1 });

// Generate order number before saving
OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await mongoose.model("Order").countDocuments({
      createdAt: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    });
    this.orderNumber = `LD-${dateStr}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
