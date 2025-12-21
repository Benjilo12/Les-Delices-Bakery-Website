import mongoose from "mongoose";

let initialized = false;

export const connect = async () => {
  mongoose.set("strictQuery", true);

  if (initialized) {
    console.log("✅ MongoDB already initialized");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "lesdelices",
    });

    initialized = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
};
