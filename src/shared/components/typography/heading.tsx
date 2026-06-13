import { cn } from "@/shared/lib/utils";
import { ElementType, ReactNode } from "react";

type Props = {
    children: ReactNode
    level?: 1 | 2 | 3 | 4 | 5 | 6
    className?: string
}

export function Heading({ children, level = 1, className }: Props) {

    const Tag: ElementType = `h${level}`

    const sizeMap: Record<number, string> = {
        1: 'text-3xl sm:text-4xl',
        2: 'text-2xl sm:text-3xl',
        3: 'text-xl sm:text-2xl',
        4: 'text-lg sm:text-xl',
        5: 'text-sm sm:text-lg',
        6: 'text-xs sm:text-sm',
    }
    
    return (
        <Tag className={cn(
            "font-bold uppercase text-center",
            sizeMap[level], className
        )}>
            {children}
        </Tag>
    )
}