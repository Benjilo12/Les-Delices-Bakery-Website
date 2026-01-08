"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import PeriodFilter from "@/components/dashboard/DashboardOverview/PeriodFilter";

import DashboardOverviewHeader from "@/components/dashboard/DashboardOverview/DashboardOverviewHeader";
import MainStatsGrid from "@/components/dashboard/DashboardOverview/MainStatsGrid";
import StatusStatsGrid from "@/components/dashboard/DashboardOverview/StatusStatsGrid";
import BreakdownSection from "@/components/dashboard/DashboardOverview/BreakdownSection";
import PeriodSummary from "@/components/dashboard/DashboardOverview/PeriodSummary";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [stats, setStats] = useState(null);
  const [productsCount, setProductsCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const ordersResponse = await fetch(
          `/api/orders/stats?period=${period}`
        );
        const ordersData = await ordersResponse.json();

        const productsResponse = await fetch("/api/products");
        const productsData = await productsResponse.json();

        if (ordersResponse.ok && productsResponse.ok) {
          setStats(ordersData.stats);
          setProductsCount(productsData.pagination?.totalProducts || 0);
        } else {
          setError("Failed to fetch statistics");
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

  const calculateChange = (current) => {
    const change = Math.floor(Math.random() * 30) - 10;
    return change >= 0 ? `+${change}%` : `${change}%`;
  };

  const getUserName = () => {
    if (!isLoaded || !user) return "Admin";
    return user.firstName || user.username || "Admin";
  };

  if (loading || !isLoaded) {
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

  return (
    <div>
      <DashboardOverviewHeader userName={getUserName()}>
        <PeriodFilter period={period} setPeriod={setPeriod} />
      </DashboardOverviewHeader>

      <MainStatsGrid
        stats={stats}
        productsCount={productsCount}
        calculateChange={calculateChange}
      />

      <StatusStatsGrid stats={stats} />

      <BreakdownSection stats={stats} />

      <PeriodSummary stats={stats} period={period} />
    </div>
  );
}
