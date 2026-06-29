import { Hero } from "@/shared/components/public/ui/hero";
import { Metadata } from "next";

const title = "Booking System"

export const metadata: Metadata = {
    title,
    description: "Booking system for beauty salon, clinics and other service-based businesses.",
}

export default function Home() {
    return (
        <section
        >
            <Hero />
        </section>
    );
}
