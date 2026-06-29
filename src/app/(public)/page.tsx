import { Heading } from "@/shared/components/typography/heading";
import { ThemeToggle } from "@/shared/components/ui/toggle-theme";
import { Metadata } from "next";
import Link from "next/link";

const title = "Booking System"

export const metadata: Metadata = {
    title,
    description: "Booking system for beauty salon, clinics and other service-based businesses.",
}

export default function Home() {
    return (
        <>
            <Heading>{title}</Heading>
            <nav>
                <Link href="/agenda" className="text-blue-500 hover:underline">
                    Go to agenda
                </Link>
            </nav>
        </>
    );
}
