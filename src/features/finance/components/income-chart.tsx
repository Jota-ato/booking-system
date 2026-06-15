'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { FinancialMetricsDTO } from "../types/finance.type";
import { formatMXN } from "@/shared/lib/currency";

const chartConfig = {
    income: {
        label: "Revenue",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

export function IncomeChart({ data }: { data: FinancialMetricsDTO['dailyIncome'] }) {

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Revenue Flow Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-75 w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `$${val}`}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value, name) => (
                                        <>
                                            <div
                                                className="h-2.5 w-2.5 shrink-0 rounded-xs"
                                                style={{ backgroundColor: chartConfig[name as keyof typeof chartConfig]?.color }}
                                            />
                                            <span className="text-muted-foreground">
                                                {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                                            </span>
                                            <span className="font-mono font-medium tabular-nums text-foreground ml-auto">
                                                {formatMXN(Number(value))}
                                            </span>
                                        </>
                                    )}
                                />
                            }
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}