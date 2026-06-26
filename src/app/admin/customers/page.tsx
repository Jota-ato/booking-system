import { adminAppointmentsService } from "@/features/appointments/admin/services/admin-appointments-service";
import { CustomerPageHeader } from "@/features/customers/components/customers-page-header";
import { CustomersStatsGrid } from "@/features/customers/components/customers-stats-grid";
import { CustomersTable } from "@/features/customers/components/customers-table";
import { customersService } from "@/features/customers/services/customers-service";
import { Container } from "@/shared/components/ui/container";
import { TIMEZONE } from "@/shared/lib/date";
import { TZDate } from "@date-fns/tz";
import { endOfMonth, startOfMonth } from "date-fns";

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const resolvedParams = await searchParams;
    const currentPage = resolvedParams?.page ? +resolvedParams.page : 1;

    const today = new Date();
    const startRange = new TZDate(startOfMonth(today), TIMEZONE);
    const endRange = new TZDate(endOfMonth(today), TIMEZONE);

    const [
        customers,
        customerAmount,
        newCustomersThisMonth,
        noShowRate
    ] =
        await Promise.all([
            customersService.getCustomers(currentPage, 5),
            customersService.getCustomerAmount(),
            customersService.getCustomersByTimeRange(startRange, endRange),
            adminAppointmentsService.getNoShowRate(startRange, endRange),
        ]);

    return (
        <section className="min-h-screen py-8 md:py-12">
            <Container className="space-y-8">
                <CustomerPageHeader
                    title="Clients"
                    description="Overview of your client base and appointment health."
                />
                <CustomersStatsGrid
                    totalCustomers={customerAmount}
                    newCustomersThisMonth={newCustomersThisMonth}
                    noShowRate={noShowRate}
                />
                <CustomersTable
                    customers={customers}
                    currentPage={currentPage}
                />
            </Container>
        </section>
    );
}