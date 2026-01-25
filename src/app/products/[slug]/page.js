import { notFound } from "next/navigation";
import { connect } from "@/mongodb/mongoose";
import Product from "@/models/product";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }) {
  try {
    await connect();
    const { slug } = await params;
    const product = await Product.findOne({ slug, isAvailable: true });

    if (!product) {
      return {
        title: "Product Not Found | Les Délices",
        description: "This product is not available.",
      };
    }

    return {
      title: `${product.name} | Les Délices By Akorfa`,
      description:
        product.description?.substring(0, 160) ||
        "Delicious artisanal bakery product",
      keywords: product.category,
      openGraph: {
        title: product.name,
        description: product.description?.substring(0, 160) || "",
        images: product.images,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product | Les Délices By Akorfa",
      description: "View our delicious bakery products",
    };
  }
}

export async function generateStaticParams() {
  try {
    await connect();
    const products = await Product.find({ isAvailable: true }).select("slug");
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

async function getProduct(slug) {
  try {
    await connect();
    const product = await Product.findOne({ slug, isAvailable: true });

    if (!product) {
      return null;
    }

    // Get related products (same category, excluding current)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isAvailable: true,
    })
      .limit(4)
      .select(
        "name slug images priceOptions category isAvailable availableFlavors customizationNotes customizationAvailable description",
      )
      .lean();

    return {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  try {
    const { slug } = await params;
    const data = await getProduct(slug);

    if (!data?.product) {
      notFound();
    }

    return <ProductDetailClient {...data} />;
  } catch (error) {
    console.error("Error loading product page:", error);
    notFound();
  }
}
