import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,
  Calendar,
  Mail,
  User as UserIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomerCard from "./CustomerCard";
import Pagination from "./Pagination";

export default function CustomersList({
  customers,
  loading,
  searchTerm,
  formatDate,
  getInitials,
  pagination,
  handlePageChange,
}) {
  return (
    <Card className="border-2 border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Customer List</CardTitle>
        <CardDescription>
          All registered customers and their details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState />
        ) : customers.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <>
            <div className="space-y-4">
              {customers.map((customer) => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                  formatDate={formatDate}
                  getInitials={getInitials}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                pagination={pagination}
                loading={loading}
                handlePageChange={handlePageChange}
                customers={customers}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600">Loading customers...</p>
    </div>
  );
}

function EmptyState({ searchTerm }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Users className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No customers found
      </h3>
      <p className="text-gray-600">
        {searchTerm
          ? `No customers found for "${searchTerm}"`
          : "No customers registered yet"}
      </p>
    </div>
  );
}
