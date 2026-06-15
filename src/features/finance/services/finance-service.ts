import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { IFinanceRepository, financeRepository } from "./finance-repository";
import { FinancialMetricsDTO, TimeRange } from "../types/finance.type";

class FinanceService {
    constructor(
        private readonly _financeRepository: IFinanceRepository
    ) {}
    async getFinancialData(
        startDate: TZDate,
        endDate: TZDate,
        range: TimeRange
    ): Promise<FinancialMetricsDTO> {
        const appointmentsData = await this._financeRepository.getRangeData(startDate, endDate);

        let dateFormatStr = "dd MMM";
        switch (range) {
            case 'year':
                dateFormatStr = "MMM";
                break;
            case 'month':
                dateFormatStr = "dd MMM";
                break;
            case 'week':
                dateFormatStr = "EEEE"; 
                break;
            case 'day':
                dateFormatStr = "HH:00";
                break;
        }

        let totalIncome = 0;
        let totalAppointments = 0;
        let expected = 0;
        let paid = 0;

        const incomeByDayRaw: Record<string, number> = {};
        const incomeByServiceRaw: Record<string, number> = {};

        appointmentsData.forEach((app) => {
            const price = Number(app.totalPrice || 0);

            if (app.status === 'CONFIRMED' || app.status === 'PAID') {
                expected += price;
            }

            if (app.status === 'PAID') {
                paid += price;
                totalIncome += price;
                totalAppointments++;

                const rawDateStr = format(new Date(app.startTime), dateFormatStr);
                const dateStr = rawDateStr.charAt(0).toUpperCase() + rawDateStr.slice(1);

                incomeByDayRaw[dateStr] = (incomeByDayRaw[dateStr] || 0) + price;

                const serviceName = app.serviceNameSnapshot || 'General';
                incomeByServiceRaw[serviceName] = (incomeByServiceRaw[serviceName] || 0) + price;
            }
        });

        const averageTicket = totalAppointments > 0 ? totalIncome / totalAppointments : 0;

        return {
            kpis: {
                totalIncome,
                totalAppointments,
                averageTicket,
                expected,
                paid
            },
            dailyIncome: Object.entries(incomeByDayRaw).map(([date, income]) => ({ date, income })),
            serviceIncome: Object.entries(incomeByServiceRaw)
                .sort(([, valA], [, valB]) => valB - valA)
                .map(([name, value]) => ({ name, value }))
        };
    }
}

// Exportamos la instancia singleton inyectando su dependencia real
export const financeService = new FinanceService(financeRepository);