import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function StatusStatsGrid({ stats }) {
  const statusStats = [
    {
      label: "Pending",
      value: stats?.statusBreakdown?.pending || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Confirmed",
      value: stats?.statusBreakdown?.confirmed || 0,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Completed",
      value: stats?.statusBreakdown?.completed || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Cancelled",
      value: stats?.statusBreakdown?.cancelled || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statusStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-xl p-6 border-2 border-gray-200 hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon className={`w-5 h-5 ${stat.color}`} />
              <p className="text-sm font-medium text-gray-700">{stat.label}</p>
            </div>
            <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
            <p className="text-xs text-gray-600 mt-1">orders</p>
          </div>
        );
      })}
    </div>
  );
}
