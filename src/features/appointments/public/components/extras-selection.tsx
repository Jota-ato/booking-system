import { ServiceWithExtras } from "@/features/services/types/service.types"
import { formatMXN } from "@/shared/lib/currency"

export function ExtrasSelection({
    service
}: {
    service: ServiceWithExtras
}) {
    return (
        <div className="space-y-4">
            {
                service.extras.map((extra) => (
                    <div
                        key={extra.id}
                        className="w-full bg-secondary rounded-md p-4 text-accent-foreground font-bold cursor-pointer hover:bg-secondary/80 transition-colors flex justify-between items-centere"
                    >
                        {extra.name}
                        <span className="text-muted-foreground font-normal">
                            {formatMXN(+extra.price)}
                        </span>
                    </div>
                ))
            }
        </div>
    )
}