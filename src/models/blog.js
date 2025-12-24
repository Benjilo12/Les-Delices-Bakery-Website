import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    excerpt: {
      type: String,
      required: true,
      maxlength: 200,
      // Short description for preview/SEO
    },

    content: {
      type: String,
      required: true,
      // Main blog content (can be HTML or Markdown)
    },

    featuredImage: {
      type: String,
      // ImageKit URL
    },

    category: {
      type: String,
      enum: ["Baking Tips", "Recipes", "offers & promotions"],
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    author: {
      name: {
        type: String,
        default: "Les Délices By Akorfa",
      },
      role: {
        type: String,
        default: "Bakery Team",
      },
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
    },

    views: {
      type: Number,
      default: 0,
    },

    readTime: {
      type: Number,
      // Estimated read time in minutes
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for queries
BlogSchema.index({ slug: 1 });
BlogSchema.index({ isPublished: 1, publishedAt: -1 });
BlogSchema.index({ category: 1 });

// Auto-set publishedAt when isPublished changes to true
BlogSchema.pre("save", function (next) {
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
