'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    type ChartConfig,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent
} from "@/shared/components/ui/chart";
import { format } from "date-fns";
// Nota: Removimos la importación de 'es' de date-fns/locale para usar el inglés por defecto.
import { formatMXN } from "@/shared/lib/currency";

const chartConfig = {
    expected: {
        label: "Expected",
        color: "var(--chart-2)",
    },
    paid: {
        label: "Collected", // "Paid" o "Collected" son excelentes opciones para ingresos cobrados
        color: "var(--chart-3)",
    },
} satisfies ChartConfig;


interface DailyIncomeChartProps {
    day: Date
    expected: number
    paid: number
}

export function DailyIncomeChart({ day, expected, paid }: DailyIncomeChartProps) {

    const chartData = [
        {
            // Formato cambiado a inglés standard: "Wednesday, June 17, 2026"
            period: format(day, "eeee, MMMM d, yyyy"),
            expected,
            paid
        },
    ];

    return (
        <ChartContainer config={chartConfig} className="min-h-50 w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatMXN(value)}
                />
                <XAxis
                    dataKey="period"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            indicator="dashed"
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

                <Bar dataKey="expected" fill="var(--color-expected)" radius={4} />
                <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}