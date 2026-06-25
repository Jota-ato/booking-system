import { Heading } from "@/shared/components/typography/heading";
import { Container } from "@/shared/components/ui/container";
import { Separator } from "@/shared/components/ui/separator";

export default function CustomersPage() {
    return (
        <section className="min-h-screen py-8 md:py-12 flex items-center justify-center">
            <Container>
                <Heading>Clients</Heading>
                <Separator className="my-8" />
                
            </Container>
        </section>
    )
}