import { NextResponse } from "next/server";
import Product from "@/models/product.model";
import { connect } from "@/mongodb/mongoose";

export async function GET(request, { params }) {
  try {
    await connect();

    const { category } = params;

    const { searchParams } = new URL(request.url);
    const available = searchParams.get("available");

    let query = { category };

    if (available === "true") {
      query.isAvailable = true;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        category,
        products,
        count: products.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
