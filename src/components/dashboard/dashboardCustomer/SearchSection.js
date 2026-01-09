import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchSection({
  searchTerm,
  setSearchTerm,
  handleSearch,
  customers,
  totalCustomers,
  clearSearch,
}) {
  return (
    <Card className="border-2 border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Search Customers</CardTitle>
        <CardDescription>Search by name, email, or username</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="h-12 text-base"
          />
          <Button onClick={handleSearch} className="h-12 px-6">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {searchTerm && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {customers.length} of {totalCustomers} customers
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear search
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
