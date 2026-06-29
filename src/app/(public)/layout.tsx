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
            className="h-full w-full flex flex-col items-center justify-center py-8 md:p-12"
        >
            <Container>
                <Header
                />
                <main>
                    {children}
                </main>
            </Container>
        </div>
    )
}