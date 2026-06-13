import { cn } from "@/shared/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import { Button } from "./button";

export function AlertDialogCustom({
    triggerLabel,
    dialogTitle,
    dialogDescription,
    srOnlyDescription = false,
    actionLabel,
    action
}: {
    triggerLabel: string
    dialogTitle: string
    dialogDescription?: string
    srOnlyDescription?: boolean
    actionLabel: string
    action: () => Promise<void> | void
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    {triggerLabel}
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
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={action}>
                        {actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}