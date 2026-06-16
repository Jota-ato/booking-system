import { Route } from 'next';
import { IconType } from 'react-icons';
import { LuLayoutDashboard, LuCircleDollarSign, LuBriefcase, LuFileText, LuCalendarDays } from 'react-icons/lu';

type navigationType = {
    label: string;
    href: Route;
    icon: IconType;
};

export const navigation: navigationType[] = [
    { label: 'Dashboard panel', href: '/admin', icon: LuLayoutDashboard },
    { label: 'Agenda', href: '/admin/agenda', icon: LuCalendarDays },
    { label: 'Finance', href: '/admin/finance', icon: LuCircleDollarSign },
    { label: 'Services', href: '/admin/services', icon: LuBriefcase },
    { label: 'Record', href: '/admin/record', icon: LuFileText },
];
