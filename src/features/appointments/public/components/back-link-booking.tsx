"use client"
import { ChevronLeft } from "lucide-react";

export function BackLinkBooking({
    callBack
}: {
    callBack: () => void;
}) {
    return (
        <ChevronLeft
            className="w-6 h-6 cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-200"
            onClick={callBack}
        />
    )
}