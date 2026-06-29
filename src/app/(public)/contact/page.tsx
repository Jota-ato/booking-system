import { ContactCard } from "@/features/contact/components/contact-card"
import { Heading } from "@/shared/components/typography/heading"
import { Separator } from "@/shared/components/ui/separator"
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
            <Separator />
            <ContactCard />
        </section>
    )
}