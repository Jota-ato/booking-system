'use client';

import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { endOfDay } from "date-fns";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function DateFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentDate = searchParams.get("date") || "";

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (newDate) {
            params.set("date", newDate);
        } else {
            params.delete("date");
        }

        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`);
    };

    const removeFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("date");
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex flex-col sm:flex-row md:items-center gap-3">
            <Field className="flex flex-row items-center space-y-0">
                <FieldLabel htmlFor="date-filter" className="whitespace-nowrap sm:-mr-6">
                    Search from date:
                </FieldLabel>
                <Input
                    id="date-filter"
                    type="date"
                    value={currentDate}
                    onChange={handleDateChange}
                    className="w-full"
                />
            </Field>

            <Button
                onClick={removeFilter}
            >
                Clear date filter
            </Button>
        </div>
    );
}