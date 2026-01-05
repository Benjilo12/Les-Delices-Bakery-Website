import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Blog from "@/models/blog";
import { currentUser } from "@clerk/nextjs/server";
import { uploadToImageKit } from "@/lib/imagekit";

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Function to calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const plainText = content.replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

//! GET - Fetch all blogs (No auth required, only published blogs for public)
export async function GET(request) {
  try {
    await connect();

    const user = await currentUser();
    const isAdmin = user?.publicMetadata?.isAdmin === true;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");

    // Pagination parameters
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Non-admin users only see published blogs
    if (!isAdmin) {
      query.isPublished = true;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    // Fetch blogs with pagination
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get the latest blog (first one from sorted results)
    const latestBlog = blogs.length > 0 ? blogs[0] : null;

    return NextResponse.json(
      {
        success: true,
        blogs,
        latestBlog,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blogs",
      },
      { status: 500 }
    );
  }
}

//! POST - Create new blog (Admin only)
export async function POST(request) {
  try {
    console.log("Starting blog creation...");
    await connect();

    // Check if user is admin
    const user = await currentUser();
    console.log("User:", user?.id, "Is Admin:", user?.publicMetadata?.isAdmin);

    if (!user || user.publicMetadata.isAdmin !== true) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const title = formData.get("title");
    const excerpt = formData.get("excerpt");
    const content = formData.get("content");
    const category = formData.get("category");
    const isPublished = formData.get("isPublished") === "true";
    const featuredImage = formData.get("featuredImage");

    // Parse tags and author
    const tags = formData.get("tags") ? JSON.parse(formData.get("tags")) : [];

    const author = formData.get("author")
      ? JSON.parse(formData.get("author"))
      : { name: "Les Délices By Akorfa", role: "Bakery Team" };

    console.log("Form data received:", {
      title,
      category,
      isPublished,
      tagsCount: tags.length,
    });

    // Basic validation
    if (!title || !excerpt || !content || !category) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Title, excerpt, content, and category are required" },
        { status: 400 }
      );
    }

    // Validate excerpt length
    if (excerpt.length > 200) {
      return NextResponse.json(
        { error: "Excerpt must be 200 characters or less" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = generateSlug(title);
    console.log("Generated slug:", slug);

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        {
          error:
            "A blog with this title already exists. Please choose a different title.",
        },
        { status: 400 }
      );
    }

    // Handle image upload to ImageKit if provided
    let featuredImageUrl = null;
    if (featuredImage && featuredImage.size > 0) {
      console.log("Uploading featured image to ImageKit...");
      try {
        const imageData = await uploadToImageKit(featuredImage);
        featuredImageUrl = imageData.url;
        console.log("Image uploaded successfully:", imageData?.fileId);
      } catch (imageError) {
        console.error("Image upload failed:", imageError);
        return NextResponse.json(
          { error: "Image upload failed" },
          { status: 500 }
        );
      }
    }

    // Calculate read time
    const readTime = calculateReadTime(content);

    const blogData = {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      author,
      isPublished,
      featuredImage: featuredImageUrl,
      readTime,
      views: 0,
    };

    // Set publishedAt if publishing immediately
    if (isPublished) {
      blogData.publishedAt = new Date();
    }

    console.log("Creating blog in database...");
    const blog = await Blog.create(blogData);
    console.log("Blog created successfully:", blog._id);

    return NextResponse.json(
      {
        success: true,
        blog,
        message: "Blog created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);

    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return NextResponse.json(
        {
          error:
            "A blog with this title already exists. Please choose a different title.",
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
