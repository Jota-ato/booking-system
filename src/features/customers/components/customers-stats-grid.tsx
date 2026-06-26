import { CalendarX, TrendingUp, Users } from "lucide-react";
import { StatCard } from "./stat-card";

interface ClientsStatsGridProps {
    totalCustomers: number;
    newCustomersThisMonth: number;
    noShowRate: number;
}

export function CustomersStatsGrid({
    totalCustomers,
    newCustomersThisMonth,
    noShowRate,
}: ClientsStatsGridProps) {
    const noShowDisplay = `${noShowRate.toFixed(1)}%`;

    const noShowVariant =
        noShowRate < 5
            ? "success"
            : noShowRate < 15
                ? "warning"
                : "destructive";

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
                label="Total clients"
                value={totalCustomers.toLocaleString()}
                description="All registered clients"
                icon={Users}
                variant="default"
            />
            <StatCard
                label="New this month"
                value={newCustomersThisMonth.toLocaleString()}
                description="Joined in the current billing period"
                icon={TrendingUp}
                variant="success"
            />
            <StatCard
                label="No-show rate"
                value={noShowDisplay}
                className="sm:col-span-2 lg:col-span-1"
                description="Missed appointments this month"
                icon={CalendarX}
                variant={noShowVariant}
            />
        </div>
    );
}