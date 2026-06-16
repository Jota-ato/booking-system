'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DollarSign, CheckSquare, TrendingUp } from "lucide-react";
import { FinancialMetricsDTO } from "../types/finance.type";

export function FinancialKPIs({ data }: { data: FinancialMetricsDTO['kpis'] }) {

    const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total income</CardTitle>
                    <DollarSign className="w-4 h-4 text-success" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold  text-success">{formatCurrency(data.totalIncome)}</div>
                    <p className="text-xs text-muted-foreground mt-1">In selected period</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Paid appointments</CardTitle>
                    <CheckSquare className="w-4 h-4 text-info" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-info">{data.totalAppointments}</div>
                    <p className="text-xs text-muted-foreground mt-1">Appointments finished</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Average ticket price</CardTitle>
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-amber-600">{formatCurrency(data.averageTicket)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Expended price per ticket</p>
                </CardContent>
            </Card>
        </div>
    );
}