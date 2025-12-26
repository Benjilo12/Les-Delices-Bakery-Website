import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Blog from "@/models/blog";
import { currentUser } from "@clerk/nextjs/server";

// GET - Fetch blogs by category (No auth required, only published)
export async function GET(request, { params }) {
  try {
    await connect();

    const { category } = params;
    const user = await currentUser();
    const isAdmin = user?.publicMetadata?.isAdmin === true;

    let query = { category };

    // Non-admin users only see published blogs
    if (!isAdmin) {
      query.isPublished = true;
    }

    const blogs = await Blog.find(query).sort({
      publishedAt: -1,
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        category,
        blogs,
        count: blogs.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blogs",
      },
      { status: 500 }
    );
  }
}
