'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
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

export function ServiceIncomeChart({ data }: { data: FinancialMetricsDTO['serviceIncome'] }) {

    // ChartConfig stands dynamic based on server-side snapshot keys
    const chartConfig = Object.fromEntries(
        data.map(({ name }, index) => [
            name,
            {
                label: name === 'General' ? 'General' : name, // O el nombre mapeado
                color: `var(--chart-${(index % 5) + 1})`,
            },
        ])
    ) satisfies ChartConfig;

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
            </CardHeader>
            <CardContent className="h-75 w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="name"
                        >
                            {data.map(({ name }, index) => (
                                <Cell
                                    key={name}
                                    fill={`var(--chart-${(index % 5) + 1})`}
                                />
                            ))}
                        </Pie>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    nameKey="name"
                                    formatter={(value, name) => (
                                        <>
                                            <div
                                                className="h-2.5 w-2.5 shrink-0 rounded-xs"
                                                style={{ backgroundColor: chartConfig[name as string]?.color }}
                                            />
                                            <span className="text-muted-foreground">
                                                {chartConfig[name as string]?.label ?? name}
                                            </span>
                                            <span className="font-mono font-medium tabular-nums text-foreground ml-auto">
                                                {formatMXN(Number(value))}
                                            </span>
                                        </>
                                    )}
                                />
                            }
                        />
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}