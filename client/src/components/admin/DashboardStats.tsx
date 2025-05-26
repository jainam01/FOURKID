import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const DashboardStats = ({
  title,
  value,
  description,
  icon,
  trend,
}: DashboardStatsProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {icon && (
            <div className="bg-primary/10 p-3 rounded-full">
              <div className="text-primary">{icon}</div>
            </div>
          )}
        </div>

        {trend && (
          <div className="mt-4 flex items-center">
            <div
              className={`flex items-center ${
                trend.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.positive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{trend.value}</span>
            </div>
            <span className="text-xs text-muted-foreground ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
