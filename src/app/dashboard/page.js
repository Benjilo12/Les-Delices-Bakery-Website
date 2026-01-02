// app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  CakeSlice,
  Users,
  TrendingUp,
  Loader2,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/orders/stats?period=${period}`);
        const data = await response.json();

        if (response.ok) {
          setStats(data.stats);
        } else {
          setError(data.error || "Failed to fetch statistics");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Unable to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  // Calculate percentage change (mock for now - you can enhance this)
  const calculateChange = (current) => {
    // This is a placeholder - you'd need previous period data to calculate real change
    const change = Math.floor(Math.random() * 30) - 10; // -10% to +20%
    return change >= 0 ? `+${change}%` : `${change}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

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
      value: "48", // You can add products count API
      change: "+3",
      icon: CakeSlice,
      color: "bg-amber-500",
    },
  ];

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
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, Eleanor! Here&apos;s what&apos;s happening.
          </p>
        </div>

        {/* Period Filter */}
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Stats Grid */}
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

      {/* Order Status Breakdown */}
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
                <p className="text-sm font-medium text-gray-700">
                  {stat.label}
                </p>
              </div>
              <h3 className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </h3>
              <p className="text-xs text-gray-600 mt-1">orders</p>
            </div>
          );
        })}
      </div>

      {/* Payment & Delivery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Payment Status */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            💳 Payment Status
          </h2>
          <div className="space-y-3">
            {Object.entries(stats?.paymentBreakdown || {}).map(
              ([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {status}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {count}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Delivery Method */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            🚚 Delivery Method
          </h2>
          <div className="space-y-3">
            {Object.entries(stats?.deliveryMethodBreakdown || {}).map(
              ([method, count]) => (
                <div
                  key={method}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {method}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {count}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Period Summary */}
      <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          📊 {period.charAt(0).toUpperCase() + period.slice(1)} Summary
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
    </div>
  );
}
