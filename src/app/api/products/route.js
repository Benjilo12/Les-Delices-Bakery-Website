// app/api/products/route.js
import { NextResponse } from "next/server";
import Product from "@/models/product.model";
import { currentUser } from "@clerk/nextjs/server";

import { connect } from "@/mongodb/mongoose";
import { uploadToImageKit } from "@/lib/imagekit";

// Function to generate slug from product name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

//! GET - Fetch all products (No auth required)
export async function GET(request) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const available = searchParams.get("available");

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (available === "true") {
      query.isAvailable = true;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        products,
        count: products.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

//! POST - Create new product (Admin only)
export async function POST(request) {
  try {
    console.log("Starting product creation...");
    await connect();

    // Check if user is admin
    const user = await currentUser();
    console.log("User:", user?.id, "Is Admin:", user?.publicMetadata?.isAdmin);

    if (!user || user.publicMetadata.isAdmin !== true) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const category = formData.get("category");
    const description = formData.get("description");
    const customizationAvailable =
      formData.get("customizationAvailable") === "true";
    const customizationNotes = formData.get("customizationNotes");
    const isAvailable = formData.get("isAvailable") === "true";

    // Parse arrays from form data
    const availableFlavors = formData.get("availableFlavors")
      ? JSON.parse(formData.get("availableFlavors"))
      : [];

    const priceOptions = formData.get("priceOptions")
      ? JSON.parse(formData.get("priceOptions"))
      : [];

    console.log("Form data received:", {
      name,
      category,
      priceOptions: priceOptions.length,
      flavors: availableFlavors.length,
    });

    // Basic validation
    if (!name || !category) {
      console.log("Missing required fields:", {
        name: !!name,
        category: !!category,
      });
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = generateSlug(name);
    console.log("Generated slug:", slug);

    // Handle multiple image uploads to ImageKit
    const imageUrls = [];
    const imageFiles = formData.getAll("images");

    if (imageFiles && imageFiles.length > 0) {
      console.log(`Uploading ${imageFiles.length} images to ImageKit...`);

      for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
          try {
            const imageData = await uploadToImageKit(imageFile);
            imageUrls.push(imageData.url);
            console.log("Image uploaded successfully:", imageData?.fileId);
          } catch (imageError) {
            console.error("Image upload failed:", imageError);
            return NextResponse.json(
              { error: "Image upload failed" },
              { status: 500 }
            );
          }
        }
      }
    }

    const productData = {
      name,
      slug,
      category,
      description,
      images: imageUrls,
      priceOptions,
      customizationAvailable,
      customizationNotes,
      availableFlavors,
      isAvailable,
    };

    console.log("Creating product in database with data:", productData);
    const product = await product.create(productData);
    console.log("Product created successfully:", product._id);

    return NextResponse.json(
      {
        success: true,
        product,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);

    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return NextResponse.json(
        {
          error:
            "A product with this name already exists. Please choose a different name.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
