export default function ManageBlogsHeader({ totalBlogs }) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Manage Blogs
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        View, manage, and delete your blog posts. You have {totalBlogs} blogs in
        total.
      </p>
    </div>
  );
}
