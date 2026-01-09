import { Users, ShieldCheck, User as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards({
  totalCustomers,
  totalAdmins,
  totalRegularUsers,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Total Customers
              </p>
              <h3 className="text-4xl font-bold text-blue-900 mt-2">
                {totalCustomers}
              </h3>
            </div>
            <div className="p-4 bg-blue-500/20 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700">Admins</p>
              <h3 className="text-4xl font-bold text-purple-900 mt-2">
                {totalAdmins}
              </h3>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-full">
              <ShieldCheck className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700">
                Regular Users
              </p>
              <h3 className="text-4xl font-bold text-green-900 mt-2">
                {totalRegularUsers}
              </h3>
            </div>
            <div className="p-4 bg-green-500/20 rounded-full">
              <UserIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
