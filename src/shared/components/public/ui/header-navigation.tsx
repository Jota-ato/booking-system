"use client"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import {
    Calendar,
    Computer,
    Menu,
    Moon,
    Home,
    Sun,
    Mail,
    User
} from "lucide-react"
import { Button } from "../../ui/button"
import { ThemeToggle } from "../../ui/toggle-theme"
import { useTheme } from "next-themes"
import { cn } from "@/shared/lib/utils"
import { usePathname } from "next/navigation"

const links = [
    {
        href: "/",
        label: "Home",
        icon: Home
    },
    {
        href: "/booking",
        label: "Book",
        icon: Calendar
    },
    {
        href: "/about-us",
        label: "About Us",
        icon: User
    },
    {
        href: "/contact",
        label: "Contact us",
        icon: Mail
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
    const pathname = usePathname()

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
                            key={link.href}
                            asChild
                        >
                            <Link
                                href={link.href}
                                className={cn("text-sm cursor-pointer",
                                    pathname === link.href ? "text-info" : ""
                                )}
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
    const pathname = usePathname()

    return (
        <div className="flex gap-4 items-center justify-between">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn("text-sm cursor-pointer flex gap-2 items-center hover:border-b hover:text-info hover:pb-1 border-info transition-all duration-150", 
                        pathname === link.href ? "text-info border-b pb-1" : ""
                    )}
                >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                </Link>
            ))}
            <ThemeToggle />
        </div>
    )
}