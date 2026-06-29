"use client"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Calendar, Computer, Menu, Moon, PersonStanding, Sparkles, Sun } from "lucide-react"
import { Button } from "../ui/button"
import { ThemeToggle } from "../ui/toggle-theme"
import { useTheme } from "next-themes"
import { cn } from "@/shared/lib/utils"

const links = [
    {
        href: "/book",
        label: "Book",
        icon: Calendar
    },
    {
        href: "/services",
        label: "Services",
        icon: Sparkles
    },
    {
        href: "/about-us",
        label: "About Us",
        icon: PersonStanding
    }
]
const themes = [
    {
        value: "light",
        label: "Light",
        icon: Sun
    },
    {
        value: "dark",
        label: "Dark",
        icon: Moon
    },
    {
        value: "system",
        label: "System",
        icon: Computer
    }
]

export function HeaderNavigation() {

    const isMobile = useIsMobile()

    return (
        <nav>
            {isMobile ?
                <MobileHeaderNavigation /> :
                <DesktopHeaderNavigation />
            }
        </nav>
    )
}

function MobileHeaderNavigation() {

    const { setTheme, theme: currentTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                >
                    <Menu />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 mr-4 rounded-md">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                    {links.map((link) => (
                        <DropdownMenuItem
                            asChild
                        >
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm cursor-pointer"
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    {themes.map((theme) => (
                        <DropdownMenuItem
                            className={cn("cursor-pointer", currentTheme === theme.value ? "text-info" : "")}
                            key={theme.value}
                            onClick={() => setTheme(theme.value)}
                        >
                            <theme.icon className=" h-4 w-4" />
                            {theme.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function DesktopHeaderNavigation() {
    return (
        <div className="flex gap-4 items-center justify-between">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm cursor-pointer flex gap-2 items-center hover:border-b hover:text-info hover:pb-1 border-info transition-all duration-150"
                >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                </Link>
            ))}
            <ThemeToggle />
        </div>
    )
}