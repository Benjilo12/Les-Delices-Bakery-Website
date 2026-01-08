export default function DashboardOverviewHeader({ userName, children }) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back,{" "}
          <span className="font-semibold text-amber-600">{userName}</span>!
          Here&apos;s what&apos;s happening.
        </p>
      </div>
      {children}
    </div>
  );
}
