import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const periodLabels = {
  day: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

export default function PeriodFilter({ period, setPeriod }) {
  return (
    <Select value={period} onValueChange={setPeriod}>
      <SelectTrigger className="w-48 bg-white border-2 border-amber-300 hover:border-amber-400 focus:ring-2 focus:ring-amber-500">
        <SelectValue>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="font-medium text-gray-900">
              {periodLabels[period]}
            </span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border-2 border-amber-300">
        <SelectItem value="day" className="hover:bg-amber-50">
          <span className="flex items-center gap-2">📅 Today</span>
        </SelectItem>
        <SelectItem value="week" className="hover:bg-amber-50">
          <span className="flex items-center gap-2">📆 This Week</span>
        </SelectItem>
        <SelectItem value="month" className="hover:bg-amber-50">
          <span className="flex items-center gap-2">🗓️ This Month</span>
        </SelectItem>
        <SelectItem value="year" className="hover:bg-amber-50">
          <span className="flex items-center gap-2">📊 This Year</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
