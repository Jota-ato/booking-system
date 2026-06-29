import { Heading } from "@/shared/components/typography/heading"
import { Metadata } from "next"

const title = "Contact us"

export const metadata: Metadata = {
    title,
    description: "Contact us for beauty salon, clinics and other service-based businesses.",
}

export default function ContactPage() {
    return (
        <section className="space-y-8 my-8">
            <Heading>{title}</Heading>
        </section>
    )
}