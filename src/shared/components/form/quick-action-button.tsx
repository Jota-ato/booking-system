'use client';
import { Button } from "@/shared/components/ui/button";
import React from "react";
import { IconType } from "react-icons";

interface QuickActionsButtonProps extends React.ComponentProps<"button"> {
    label: string
    Icon: IconType
    variant?: 'default' | 'outline' | 'destructive'
}

const QuickActionsButton = React.forwardRef<HTMLButtonElement, QuickActionsButtonProps>(
    ({ label, Icon, variant = 'default', className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                variant={variant}
                className={`w-full justify-start gap-3 shadow-sm ${className}`}
                size="lg"
                {...props}
            >
                <Icon />
                <span className="text-xs sm:text-sm max-w-4/5 truncate">{label}</span>
            </Button>
        );
    }
);

QuickActionsButton.displayName = "QuickActionsButton"; // Buena práctica con forwardRef

export default QuickActionsButton;