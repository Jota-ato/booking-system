import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/shared/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem
} from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";
import { ChevronDown, Sun, Moon, Monitor, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggleSideBar({
    isCollapsed
}: {
    isCollapsed: boolean
}) {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const themes = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
        { value: 'system', label: 'System', icon: Monitor },
    ]

    if (!mounted) {
        return (
            <Collapsible defaultOpen className="group/collapsible opacity-0">
                 <div className="h-10"></div> 
            </Collapsible>
        )
    }

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex items-center gap-2">
                        <Palette className="size-4 md:size-5 shrink-0" />
                        {!isCollapsed && (<>
                            Theme
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </>)}
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
            </SidebarGroup>
            <CollapsibleContent>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {themes.map(({ value, label, icon: Icon }) => (
                            <SidebarMenuItem
                                key={value}
                                onClick={() => setTheme(value)}
                                className={cn(
                                    "flex items-center gap-2 text-muted-foreground text-xs sm:text-sm px-4 py-2 hover:bg-secondary hover:text-accent-foreground rounded-xl transition-all duration-100 cursor-pointer",
                                    theme === value ? 'text-accent-foreground' : ''
                                )}
                            >
                                <Icon className={cn("size-4 md:size-5 shrink-0", theme === value ? 'text-accent-foreground' : 'text-muted-foreground')} />
                                {!isCollapsed ? label: ''}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </CollapsibleContent>
        </Collapsible>
    )
}