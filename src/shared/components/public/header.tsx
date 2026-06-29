import { Heading } from "../typography/heading"
import { HeaderNavigation } from "./header-navigation"

export function Header({
    title
}: {
    title: string
}) {
    return (
        <header className="flex gap-4 items-center justify-between">
            <Heading className="text-xl! font-bold">{title}</Heading>

            <HeaderNavigation/>
        </header>
    )
}