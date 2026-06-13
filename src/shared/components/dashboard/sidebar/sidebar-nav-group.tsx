import { IconType } from 'react-icons';
import { Route } from 'next';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { currentPath } from '@/shared/lib/ui';

export type NavItem = {
    href: Route;
    label: string;
    icon: IconType;
}

type SidebarNavGroupProps = {
    label: string;
    groupIcon: IconType;
    items: NavItem[];
    pathName: string;
    isCollapsed: boolean;
}

export function SidebarNavGroup({ label, groupIcon: GroupIcon, items, pathName, isCollapsed }: SidebarNavGroupProps) {
    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel className="text-xs md:text-sm" asChild>
                    <CollapsibleTrigger className="flex items-center gap-2">
                        <GroupIcon className="size-4 shrink-0" />
                        {!isCollapsed && (
                            <>
                                {label}
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </>
                        )}
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, i) => (
                                <SidebarNavItem
                                    key={item.href + i}
                                    item={item}
                                    pathName={pathName}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}

type SidebarNavItemProps = {
    item: NavItem;
    pathName: string;
    isCollapsed: boolean;
}

function SidebarNavItem({ item, pathName, isCollapsed }: SidebarNavItemProps) {
    const isActive = currentPath(item.href, pathName)

    return (
        <SidebarMenuItem>
            <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-2 text-xs sm:text-sm p-2 hover:bg-secondary hover:text-info rounded-xl transition-all duration-100",
                    isActive && 'bg-secondary text-info'
                )}
            >
                <item.icon className="size-4 sm:size-5 shrink-0" />
                {!isCollapsed ? item.label : ''}
            </Link>
        </SidebarMenuItem>
    )
}