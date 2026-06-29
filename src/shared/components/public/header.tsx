import Link from "next/link"
import { Heading } from "../typography/heading"
import { HeaderNavigation } from "./header-navigation"

export function Header() {
    return (
        <header className="flex gap-4 items-center justify-between">
            <Heading className="text-xl! font-bold">
                <Link
                    href="/"
                >
                    Booking System
                </Link>
            </Heading>

            <HeaderNavigation />
        </header>
    )
}