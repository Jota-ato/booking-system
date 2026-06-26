import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    variant?: "default" | "success" | "warning" | "destructive";
    className?: string;
}

const variantStyles = {
    default: {
        iconWrapper: "bg-primary/10 text-primary",
    },
    success: {
        iconWrapper: "bg-success/10 text-success",
    },
    warning: {
        iconWrapper: "bg-warning/10 text-warning",
    },
    destructive: {
        iconWrapper: "bg-destructive/10 text-destructive",
    },
} satisfies Record<string, { iconWrapper: string }>;

export function StatCard({
    label,
    value,
    description,
    icon: Icon,
    variant = "default",
    className,
}: StatCardProps) {
    const styles = variantStyles[variant];

    return (
        <Card className={cn("transition-shadow hover:shadow-md", className)}>
            <CardContent>
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground truncate">
                            {label}
                        </p>
                        <p className="text-3xl font-semibold tracking-tight text-foreground">
                            {value}
                        </p>
                        {description && (
                            <p className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                    <div
                        className={cn(
                            "shrink-0 rounded-xl p-2.5",
                            styles.iconWrapper
                        )}
                    >
                        <Icon className="size-5" aria-hidden />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}