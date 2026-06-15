import { FinanceDashboard } from "@/features/finance/components/finance-dashboard";
import { financeService } from "@/features/finance/services/finance-service"
import { TimeRange } from "@/features/finance/types/finance.type"
import { TIMEZONE } from "@/shared/lib/date"
import { TZDate } from "@date-fns/tz"
import { endOfDay, endOfMonth, endOfWeek, endOfYear, startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns";


function getDateRange(range: TimeRange, timezone: string) {
  const now = new TZDate(new Date(), timezone);

  console.log(range)
  switch (range) {
    case "day":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "week":
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    case "year":
      return { start: startOfYear(now), end: endOfYear(now) };
    case "month":
    default:
      return { start: startOfMonth(now), end: endOfMonth(now) };
  }
}

export default async function FinancePage({
  searchParams
}: {
  searchParams: Promise<{ range?: TimeRange }>
}) {
  const { range = 'month' } = await searchParams
  const { start: startRange, end: endRange } = getDateRange(range, TIMEZONE);

  const data = await financeService.getFinancialData(startRange, endRange, range)

  return (
    <section className="py-4">
      <FinanceDashboard
        data={data}
      />
    </section>
  )
}