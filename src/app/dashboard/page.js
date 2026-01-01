"use client";

import { ShoppingBag, CakeSlice, Users, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Orders",
      value: "156",
      change: "+12%",
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      label: "Products",
      value: "48",
      change: "+3",
      icon: CakeSlice,
      color: "bg-amber-500",
    },
    {
      label: "Customers",
      value: "892",
      change: "+8%",
      icon: Users,
      color: "bg-green-500",
    },
    {
      label: "Revenue",
      value: "GH₵ 12,450",
      change: "+18%",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, Eleanor! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
        <div className="text-gray-600">
          <p>Order list will be displayed here...</p>
        </div>
      </div>
    </div>
  );
}
