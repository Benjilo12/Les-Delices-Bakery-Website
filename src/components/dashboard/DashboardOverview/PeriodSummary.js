const periodLabels = {
  day: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

export default function PeriodSummary({ stats, period }) {
  return (
    <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3">
        📊 {periodLabels[period]} Summary
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-amber-900">
            {stats?.totalOrders || 0}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-amber-900">
            GH₵ {stats?.totalRevenue?.toFixed(2) || 0}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Avg Order Value</p>
          <p className="text-2xl font-bold text-amber-900">
            GH₵ {stats?.averageOrderValue?.toFixed(2) || 0}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-amber-900">
            {stats?.statusBreakdown?.completed || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
