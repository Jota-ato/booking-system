"use client"
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    useSidebar,
} from "../ui/sidebar";
import { navigation } from "./sidebar/constants";
import { SidebarNavGroup } from "./sidebar/sidebar-nav-group";
import { MdMenu } from "react-icons/md";
import { SignOutButton } from "./sidebar/sign-out-button";
import Link from "next/link";
import { ThemeToggleSideBar } from "./sidebar/theme-sidebar-toggle";

export function DashboardSidebar() {

    const { open: isCollapse } = useSidebar()
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-4">
                {isCollapse && (<>
                    <Link
                        href={'/admin'}
                    >
                        <h1 className="text-lg md:text-xl font-bold text-primary">Booking system</h1>
                    </Link>
                    <span className="text-sm text-muted-foreground">Admin dashboard</span>
                </>)}
            </SidebarHeader>
            <SidebarContent>
                <SidebarNavGroup
                    label="Navigation"
                    isCollapsed={!isCollapse}
                    items={navigation}
                    pathName={pathname}
                    groupIcon={MdMenu}
                />
                <ThemeToggleSideBar
                    isCollapsed={!isCollapse}
                />
            </SidebarContent>
            <SidebarFooter className="p-4">
                <SignOutButton />
            </SidebarFooter>
        </Sidebar>
    )
}