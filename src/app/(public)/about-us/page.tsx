import { Heading } from "@/shared/components/typography/heading"
import { Metadata } from "next"

const tittle = "About Us"

export const metadata: Metadata = {
    title: tittle,
    description: "About us page for beauty salon, clinics and other service-based businesses.",
}

export default function AboutUsPage() {
    return (
        <section className="my-8">
            <Heading>{tittle}</Heading>
        </section>
    )
}