// app/api/products/route.js
import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Product from "@/models/product.model";
import { currentUser } from "@clerk/nextjs/server";
import { deleteFromImageKit, uploadToImageKit } from "@/lib/imagekit";

export async function GET(request, { params }) {
  try {
    await connect();

    const { slug } = params;

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}

// PUT - Update product (Admin only)
export async function PUT(request, { params }) {
  try {
    console.log("Starting product update...");
    await connect();

    // Check if user is admin
    const user = await currentUser();
    console.log("User:", user?.id, "Is Admin:", user?.publicMetadata?.isAdmin);

    if (!user || user.publicMetadata.isAdmin !== true) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;
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

    // Get existing images and new images
    const existingImages = formData.get("existingImages")
      ? JSON.parse(formData.get("existingImages"))
      : [];

    const newImageFiles = formData.getAll("newImages");

    console.log("Update data received:", {
      name,
      category,
      existingImages: existingImages.length,
      newImages: newImageFiles.length,
    });

    // Handle new image uploads
    const newImageUrls = [];
    if (newImageFiles && newImageFiles.length > 0) {
      console.log(
        `Uploading ${newImageFiles.length} new images to ImageKit...`
      );

      for (const imageFile of newImageFiles) {
        if (imageFile && imageFile.size > 0) {
          try {
            const imageData = await uploadToImageKit(imageFile);
            newImageUrls.push(imageData.url);
            console.log("New image uploaded successfully:", imageData?.fileId);
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

    // Combine existing and new images
    const allImages = [...existingImages, ...newImageUrls];

    // Generate new slug if name changed
    let newSlug = slug;
    if (name) {
      newSlug = generateSlug(name);

      // Check if new slug exists (and it's not the current product)
      if (newSlug !== slug) {
        const existingProduct = await Product.findOne({ slug: newSlug });
        if (existingProduct) {
          return NextResponse.json(
            {
              error: "A product with this name already exists",
            },
            { status: 400 }
          );
        }
      }
    }

    const updateData = {
      ...(name && { name, slug: newSlug }),
      ...(category && { category }),
      ...(description !== null && { description }),
      images: allImages,
      priceOptions,
      customizationAvailable,
      ...(customizationNotes !== null && { customizationNotes }),
      availableFlavors,
      isAvailable,
    };

    const product = await Product.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    console.log("Product updated successfully:", product._id);

    return NextResponse.json(
      {
        success: true,
        product,
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (Admin only)
export async function DELETE(request, { params }) {
  try {
    console.log("Starting product deletion...");
    await connect();

    // Check if user is admin
    const user = await currentUser();
    console.log("User:", user?.id, "Is Admin:", user?.publicMetadata?.isAdmin);

    if (!user || user.publicMetadata.isAdmin !== true) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    // Delete images from ImageKit before deleting product
    if (product.images && product.images.length > 0) {
      console.log(`Deleting ${product.images.length} images from ImageKit...`);
      for (const imageUrl of product.images) {
        // Extract fileId from ImageKit URL
        const fileId = imageUrl.split("/").pop().split("?")[0];
        try {
          await deleteFromImageKit(fileId);
          console.log("Image deleted from ImageKit:", fileId);
        } catch (error) {
          console.error("Failed to delete image from ImageKit:", error);
          // Continue with product deletion even if image deletion fails
        }
      }
    }

    await Product.findOneAndDelete({ slug });

    console.log("Product deleted successfully:", product._id);

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
