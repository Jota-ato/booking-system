import { ReviewsSection } from "@/shared/components/public/landing/reviews-section";
import { ServicesSection } from "@/shared/components/public/landing/services-section";
import { Hero } from "@/shared/components/public/ui/hero";
import { getSharedPublicServices } from "@/shared/lib/cache";
import { Metadata } from "next";

const title = "Booking System"

export const metadata: Metadata = {
    title,
    description: "Booking system for beauty salon, clinics and other service-based businesses.",
}

export default async function Home() {

    const services = await getSharedPublicServices()

    return (
        <section>
            <Hero />
            <ServicesSection
                services={services}
            />
            <ReviewsSection />
        </section>
    );
}
