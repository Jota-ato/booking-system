'use client';

import { FinancialMetricsDTO } from "../types/finance.type";
import { FinancialKPIs } from "./finance-kpis";
import { IncomeChart } from "./income-chart";
import { ServiceIncomeChart } from "./service-income-chart";
import { TimeRangeFilter } from "./time-range-filter";

interface FinancialDashboardProps {
    data: FinancialMetricsDTO;
}

export function FinanceDashboard({ data }: FinancialDashboardProps) {
    return (
        <div className="space-y-8 w-[90%] max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Revenue Overview</h2>
                    <p className="text-sm text-muted-foreground">
                        Financial metrics based on the selected period.
                    </p>
                </div>
                <TimeRangeFilter />
            </div>

            <FinancialKPIs data={data.kpis} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <IncomeChart data={data.dailyIncome} />
                <ServiceIncomeChart data={data.serviceIncome} />
            </div>
        </div>
    );
}