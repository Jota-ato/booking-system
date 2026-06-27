import { formatPhone } from "@/shared/utils/phone"
import { CustomerAvatar } from "./customer-avatar"
import { CustomerWithAppointmentCount } from "../types/customer.types"
import { ActivityBadge } from "./customer-badge"
import Link from "next/link"

export function CustomerRow({ customer }: { customer: CustomerWithAppointmentCount }) {
    return (
        <Link
            href={`/admin/customers/${customer.id}/customer`}
            className="p-4 grid grid-cols-4 gap-4 items-center border-b last:border-0"
        >
            <div className="flex items-center gap-3">
                <CustomerAvatar name={customer.name} lastName={customer.lastName} />
                <span className="text-xs font-medium">{customer.name} {customer.lastName}</span>
            </div>
            <span className="text-muted-foreground font-mono text-sm">
                {formatPhone(customer.phone)}
            </span>
            <span>{customer.appointmentCount}</span>
            <ActivityBadge appointmentCount={customer.thisMonthAppointments} />
        </Link>
    )
}