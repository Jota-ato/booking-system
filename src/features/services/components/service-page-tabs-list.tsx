import {
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";

export function ServicePageTabsList() {
    return (
        <TabsList className="flex gap-4 sm:gap-8">
            <TabsTrigger className="text-xs sm:text-sm" value="activeServices">Active services</TabsTrigger>
            <TabsTrigger className="text-xs sm:text-sm" value="unactiveServices">Unactive services</TabsTrigger>
            <TabsTrigger className="text-xs sm:text-sm" value="activeExtras">Active extras</TabsTrigger>
            <TabsTrigger className="text-xs sm:text-sm" value="unactiveExtras">Unactive extras</TabsTrigger>
        </TabsList>
    )
}