import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { IFinanceRepository, financeRepository } from "./finance-repository";
import { FinancialMetricsDTO, TimeRange } from "../types/finance.type";
import { TIMEZONE } from "@/shared/lib/date";

/**
 * Application-layer service responsible for computing financial metrics
 * from raw appointment data.
 *
 * Retrieves appointment records from the repository for a given date range,
 * then aggregates them into KPIs and time/service breakdowns suitable for
 * dashboard consumption.
 *
 * @example
 * const metrics = await financeService.getFinancialData(startDate, endDate, 'month');
 */
class FinanceService {
    /**
     * @param financeRepository - Data access layer for financial appointment records.
     */
    constructor(
        private readonly financeRepository: IFinanceRepository
    ) { }

    /**
     * Computes aggregated financial metrics for a given date range and time granularity.
     *
     * The method fetches all relevant appointments (`PAID`, `CONFIRMED`, `COMPLETED`)
     * from the repository and derives the following:
     *
     * - **KPIs**: total income, total paid appointments, average ticket, expected revenue,
     *   and confirmed-but-unpaid revenue.
     * - **Daily income**: revenue grouped by a date label whose format depends on `range`
     *   (e.g. `"HH:00"` for day, `"EEEE"` for week, `"dd MMM"` for month, `"MMM"` for year).
     * - **Service income**: revenue grouped by service name, sorted descending by value.
     *
     * Only `PAID` appointments contribute to `totalIncome`, `totalAppointments`,
     * and the chart breakdowns. `CONFIRMED` appointments are included only in `expected`.
     *
     * @param startDate - The beginning of the reporting period (inclusive), timezone-aware.
     * @param endDate   - The end of the reporting period (inclusive), timezone-aware.
     * @param range     - The time granularity used to format date labels in `dailyIncome`.
     *                    Accepted values: `'day'`, `'week'`, `'month'`, `'year'`.
     * @returns A promise that resolves to a {@link FinancialMetricsDTO} containing
     *          KPIs, daily income series, and per-service income breakdown.
     */
    async getFinancialData(
        startDate: TZDate,
        endDate: TZDate,
        range: TimeRange
    ): Promise<FinancialMetricsDTO> {
        const appointmentsData = await this.financeRepository.getRangeData(startDate, endDate);

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

    async getExpectedData(
        startDate: Date,
        endDate: Date
    ) {

        const startDateTZ = new TZDate(startDate, TIMEZONE);
        const endDateTZ = new TZDate(endDate, TIMEZONE);

        const appointmentsData = await this.financeRepository.getRangeData(startDateTZ, endDateTZ);

        const expected = appointmentsData
            .filter(apt => apt.status === 'CONFIRMED' || apt.status === 'PAID' || apt.status === 'COMPLETED')
            .reduce((acc, apt) => acc + Number(apt.totalPrice), 0);
        
        const paid = appointmentsData
            .filter(apt => apt.status === 'PAID')
            .reduce((acc, apt) => acc + Number(apt.totalPrice), 0);
        
        return {
            expected,
            paid
        }
    }
}

export const financeService = new FinanceService(financeRepository);