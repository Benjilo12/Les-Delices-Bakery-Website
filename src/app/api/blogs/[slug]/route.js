import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Blog from "@/models/blog";
import { currentUser } from "@clerk/nextjs/server";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit";

// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

// Helper function to calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// GET - Fetch single blog by slug (No auth required)
export async function GET(request, { params }) {
  try {
    await connect();

    // FIX: Add await to unwrap params Promise
    const { slug } = await params;

    const user = await currentUser();
    const isAdmin = user?.publicMetadata?.isAdmin === true;

    let query = { slug };

    // Non-admin users can only view published blogs
    if (!isAdmin) {
      query.isPublished = true;
    }

    const blog = await Blog.findOne(query);

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      );
    }

    // Increment view count (only for published blogs and non-admin users)
    if (blog.isPublished && !isAdmin) {
      blog.views += 1;
      await blog.save();
    }

    return NextResponse.json(
      {
        success: true,
        blog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog",
      },
      { status: 500 }
    );
  }
}

// PUT - Update blog (Admin only)
export async function PUT(request, { params }) {
  try {
    console.log("Starting blog update...");
    await connect();

    // Check if user is admin
    const user = await currentUser();
    console.log("User:", user?.id, "Is Admin:", user?.publicMetadata?.isAdmin);

    if (!user || user.publicMetadata.isAdmin !== true) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FIX: Add await to unwrap params Promise
    const { slug } = await params;

    const formData = await request.formData();

    const title = formData.get("title");
    const excerpt = formData.get("excerpt");
    const content = formData.get("content");
    const category = formData.get("category");
    const isPublished = formData.get("isPublished") === "true";
    const existingImageUrl = formData.get("existingImageUrl");
    const newFeaturedImage = formData.get("newFeaturedImage");

    // Parse tags and author
    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags"))
      : undefined;

    const author = formData.get("author")
      ? JSON.parse(formData.get("author"))
      : undefined;

    console.log("Update data received:", {
      slug,
      title,
      category,
      isPublished,
    });

    // Find existing blog
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Handle featured image update
    let featuredImageUrl = existingImageUrl || blog.featuredImage;

    if (newFeaturedImage && newFeaturedImage.size > 0) {
      console.log("Uploading new featured image...");
      try {
        const imageData = await uploadToImageKit(newFeaturedImage);
        featuredImageUrl = imageData.url;
        console.log("New image uploaded successfully:", imageData?.fileId);

        // Delete old image if exists
        if (blog.featuredImage) {
          const oldFileId = blog.featuredImage.split("/").pop().split("?")[0];
          await deleteFromImageKit(oldFileId);
          console.log("Old image deleted from ImageKit");
        }
      } catch (imageError) {
        console.error("Image upload failed:", imageError);
        return NextResponse.json(
          { error: "Image upload failed" },
          { status: 500 }
        );
      }
    }

    // Generate new slug if title changed
    let newSlug = slug;
    if (title && title !== blog.title) {
      newSlug = generateSlug(title);

      // Check if new slug exists
      if (newSlug !== slug) {
        const existingBlog = await Blog.findOne({ slug: newSlug });
        if (existingBlog) {
          return NextResponse.json(
            { error: "A blog with this title already exists" },
            { status: 400 }
          );
        }
      }
    }

    // Calculate read time if content changed
    let readTime = blog.readTime;
    if (content) {
      readTime = calculateReadTime(content);
    }

    // Build update data
    const updateData = {
      ...(title && { title, slug: newSlug }),
      ...(excerpt && { excerpt }),
      ...(content && { content }),
      ...(category && { category }),
      ...(tags !== undefined && { tags }),
      ...(author && { author }),
      featuredImage: featuredImageUrl,
      readTime,
      isPublished,
    };

    // Set publishedAt if publishing for the first time
    if (isPublished && !blog.isPublished && !blog.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log("Blog updated successfully:", updatedBlog._id);

    return NextResponse.json(
      {
        success: true,
        blog: updatedBlog,
        message: "Blog updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog (Admin only)
export async function DELETE(request, { params }) {
  try {
    console.log("Starting blog deletion...");
    await connect();

    // Check if user is admin
    const user = await currentUser();
    console.log("User:", user?.id, "Is Admin:", user?.publicMetadata?.isAdmin);

    if (!user || user.publicMetadata.isAdmin !== true) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FIX: Add await to unwrap params Promise
    const { slug } = await params;

    console.log("Deleting blog with slug:", slug);

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      console.log("Blog not found with slug:", slug);
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Delete featured image from ImageKit if exists
    if (blog.featuredImage) {
      console.log("Deleting featured image from ImageKit...");
      const fileId = blog.featuredImage.split("/").pop().split("?")[0];
      try {
        await deleteFromImageKit(fileId);
        console.log("Image deleted from ImageKit:", fileId);
      } catch (error) {
        console.error("Failed to delete image from ImageKit:", error);
        // Continue with blog deletion even if image deletion fails
      }
    }

    await Blog.findOneAndDelete({ slug });

    console.log("Blog deleted successfully:", blog._id);

    return NextResponse.json(
      {
        success: true,
        message: "Blog deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
