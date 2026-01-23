import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Blog from "@/models/blog";

// GET - Fetch blogs by category (Public access - no authentication required)
export async function GET(request, { params }) {
  try {
    await connect();

    const { category } = params;

    // Decode URL-encoded category (if needed)
    const decodedCategory = decodeURIComponent(category);

    // Build query - ALWAYS show only published blogs to public
    const query = {
      category: decodedCategory,
      isPublished: true,
    };

    const blogs = await Blog.find(query).sort({
      publishedAt: -1,
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        category: decodedCategory,
        blogs,
        count: blogs.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blogs",
      },
      { status: 500 },
    );
  }
}
