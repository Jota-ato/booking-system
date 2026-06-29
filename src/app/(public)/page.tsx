import { Header } from "@/shared/components/public/header";
import { Heading } from "@/shared/components/typography/heading";
import { Container } from "@/shared/components/ui/container";
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
        <section
            className="h-full w-full flex flex-col items-center justify-center py-8 md:p-12"
        >
            <Container>
                <Header 
                    title={title}
                />
            </Container>
        </section>
    );
}
