import { Heading } from "@/shared/components/typography/heading";
import { Separator } from "@/shared/components/ui/separator";

interface ClientsPageHeaderProps {
    title: string;
    description?: string;
}

export function CustomerPageHeader({ title, description }: ClientsPageHeaderProps) {
    return (
        <div className="space-y-2">
            <div className="flex flex-col gap-1">
                <Heading>{title}</Heading>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            <Separator />
        </div>
    );
}