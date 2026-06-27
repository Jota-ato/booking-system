import { Customer } from "@/db/schema"
import { formatPhone } from "@/shared/utils/phone"

export function CustomerHeader({
    customer
}: {
    customer: Customer
}) {
    return (
        <header className="border-b pb-4">
            <h1 className="text-3xl font-bold tracking-tight">
                {customer.name} {customer.lastName}
            </h1>
            <p className="text-muted-foreground mt-1">
                {formatPhone(customer.phone)}
            </p>
        </header>
    )
}