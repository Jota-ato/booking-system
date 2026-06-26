import { Badge } from "@/shared/components/ui/badge"

type ActivityTier = "frequent" | "regular" | "occasional" | "new"

function getActivityTier(count: number): ActivityTier {
    if (count >= 10) return "frequent"
    if (count >= 5)  return "regular"
    if (count >= 1)  return "occasional"
    return "new"
}

const tierConfig: Record<ActivityTier, { label: string; className: string }> = {
    frequent:   { label: "Frequent",   className: "bg-success/10 text-success border-success/20" },
    regular:    { label: "Regular",    className: "bg-primary/10 text-primary border-primary/20" },
    occasional: { label: "Occasional", className: "bg-secondary/10 text-secondary-foreground border-secondary/20" },
    new:        { label: "New",        className: "bg-muted text-muted-foreground border-border" },
}

export function ActivityBadge({ appointmentCount }: { appointmentCount: number }) {
    const tier = getActivityTier(appointmentCount)
    const { label, className } = tierConfig[tier]

    return (
        <Badge variant="outline" className={className}>
            {label}
        </Badge>
    )
}