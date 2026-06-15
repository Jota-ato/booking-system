export type TimeRange = 'day' | 'week' | 'month' | 'year';

export interface FinancialMetricsDTO {
    kpis: {
        totalIncome: number;
        totalAppointments: number;
        averageTicket: number;
        expected: number;
        paid: number;
    };
    dailyIncome: { date: string; income: number }[];
    serviceIncome: { name: string; value: number }[];
}