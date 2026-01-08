import { ShoppingBag, CakeSlice, TrendingUp, Calendar } from "lucide-react";

export default function MainStatsGrid({
  stats,
  productsCount,
  calculateChange,
}) {
  const mainStats = [
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      change: calculateChange(stats?.totalOrders),
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      label: "Total Revenue",
      value: `GH₵ ${stats?.totalRevenue?.toFixed(2) || 0}`,
      change: calculateChange(stats?.totalRevenue),
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      label: "Average Order",
      value: `GH₵ ${stats?.averageOrderValue?.toFixed(2) || 0}`,
      change: calculateChange(stats?.averageOrderValue),
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      label: "Products",
      value: productsCount,
      change: "+3",
      icon: CakeSlice,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {mainStats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.change.startsWith("+");

        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all hover:border-amber-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-sm font-semibold px-2 py-1 rounded ${
                  isPositive
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
