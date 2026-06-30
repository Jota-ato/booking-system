import Link from "next/link"
import { HeaderNavigation } from "./header-navigation"
import { Heading } from "../../typography/heading"
import { PawPrint } from "lucide-react"
import { Logo } from "../../ui/logo"

export function Header() {
    return (
        <header className="flex gap-4 items-center justify-between py-8">
            <Heading className="text-xl! font-bold">
                <Link
                    href="/"
                    className="flex items-center gap-2"
                >
                    Manita de gato
                    <Logo />
                </Link>
            </Heading>

            <HeaderNavigation />
        </header>
    )
}