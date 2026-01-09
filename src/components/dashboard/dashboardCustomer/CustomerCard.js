import { ShieldCheck, Calendar, Mail, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomerCard({ customer, formatDate, getInitials }) {
  return (
    <div className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border-2 border-gray-200">
          <AvatarImage src={customer.profilePicture} alt={customer.firstName} />
          <AvatarFallback className="bg-linear-to-br from-blue-400 to-purple-500 text-white text-lg font-bold">
            {getInitials(customer.firstName, customer.lastName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {customer.firstName} {customer.lastName || ""}
            </h3>
            {customer.isAdmin && (
              <Badge className="bg-purple-100 text-purple-800 border border-purple-300">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{customer.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-400" />
              <span>@{customer.username}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Joined {formatDate(customer.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">Clerk ID:</span>
              <span className="font-mono text-xs">
                {customer.clerkId.substring(0, 12)}...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
