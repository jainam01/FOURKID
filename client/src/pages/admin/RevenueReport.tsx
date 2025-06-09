// src/components/admin/RevenueReport.tsx

import { useState, useMemo } from "react";
import { format, subMonths, startOfMonth, isSameMonth } from "date-fns";
import { OrderWithItems } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, ArrowUp } from "lucide-react";

interface RevenueReportProps {
  orders: OrderWithItems[];
}

export const RevenueReport = ({ orders = [] }: RevenueReportProps) => {
  // State to hold the selected month for filtering (e.g., "2023-10")
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  // Generate a unique list of months from orders for the filter dropdown
  const monthOptions = useMemo(() => {
    const months = new Set<string>();
    orders.forEach(order => {
      // Store in 'yyyy-MM' format for easy sorting and filtering
      months.add(format(new Date(order.createdAt), 'yyyy-MM'));
    });
    return Array.from(months).sort().reverse();
  }, [orders]);

  // Perform all calculations based on the selected month.
  const {
    currentPeriodRevenue,
    previousPeriodRevenue,
    percentageChange,
    filteredOrders,
  } = useMemo(() => {
    const now = new Date();
    let currentOrders: OrderWithItems[];
    let previousPeriodDate: Date;

    if (selectedMonth === "all") {
      currentOrders = orders;
      previousPeriodDate = subMonths(startOfMonth(now), 1);
    } else {
      const selectedDate = new Date(`${selectedMonth}-01T12:00:00Z`); // Use a fixed time to avoid timezone issues
      currentOrders = orders.filter(order =>
        isSameMonth(new Date(order.createdAt), selectedDate)
      );
      previousPeriodDate = subMonths(selectedDate, 1);
    }
    
    const previousPeriodOrders = orders.filter(order =>
        isSameMonth(new Date(order.createdAt), previousPeriodDate)
    );

    const currentRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0);
    const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);

    let percentChange = 0;
    if (previousRevenue > 0) {
      percentChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    } else if (currentRevenue > 0) {
      percentChange = 100; // If previous was 0 and current is positive, it's a 100% increase
    }

    return {
      currentPeriodRevenue: currentRevenue,
      previousPeriodRevenue: previousRevenue,
      percentageChange: percentChange,
      filteredOrders: currentOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    };
  }, [orders, selectedMonth]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Revenue Report</CardTitle>
            <CardDescription>Analyze sales revenue by month.</CardDescription>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              {monthOptions.map(month => (
                <SelectItem key={month} value={month}>
                  {format(new Date(`${month}-02`), 'MMMM yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl font-bold">
            ₹{currentPeriodRevenue.toLocaleString('en-IN')}
          </div>
          {selectedMonth !== 'all' && (
            <div className={`flex items-center text-sm font-medium ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {percentageChange >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {percentageChange.toFixed(1)}% vs. last month
            </div>
          )}
        </div>

        <Separator className="mb-6" />

        <h3 className="font-semibold mb-2">
            Orders for {selectedMonth === 'all' ? 'All Time' : format(new Date(`${selectedMonth}-02`), 'MMMM yyyy')}
            ({filteredOrders.length})
        </h3>
        
        <div className="max-h-[400px] overflow-y-auto">
            {filteredOrders.length > 0 ? (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredOrders.map(order => (
                    <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "cancelled" ? "bg-red-100 text-red-700" : 
                        order.status === "delivered" ? "bg-green-100 text-green-700" : 
                        "bg-blue-100 text-blue-700"
                        }`}>
                            {order.status?.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </TableCell>
                    <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    No orders found for this period.
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};