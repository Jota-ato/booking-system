import { Footer } from "@/shared/components/public/ui/footer"
import { Header } from "@/shared/components/public/ui/header"
import { Container } from "@/shared/components/ui/container"
import { ReactNode } from "react"

export default function PublicLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <div
        >
            <Container>
                <Header
                />
                <main>
                    {children}
                </main>
            </Container>
            <Footer />
        </div>
    )
}