import { cn } from "@/shared/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import { Button } from "./button";
import { IconType } from "react-icons";

export function AlertDialogCustom({
    triggerIcon: TriggerIcon,
    triggerLabel,
    dialogTitle,
    dialogDescription,
    srOnlyDescription = false,
    fullWith = false, 
    actionLabel,
    showText = true,
    action
}: {
    triggerIcon?: IconType
    triggerLabel: string
    dialogTitle: string
    dialogDescription?: string
    srOnlyDescription?: boolean
    showText?: boolean
    fullWith?: boolean
    actionLabel: string
    action: () => Promise<void> | void
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                className={cn("flex items-center justify-center", fullWith ? 'w-full' : '')}
                variant="destructive">
                    {TriggerIcon && <TriggerIcon className="mr-2 h-5 w-5" />}
                    {showText && (triggerLabel)}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {dialogTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription className={cn(srOnlyDescription ? "sr-only" : "")}>
                        {dialogDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={action}>
                        {actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}