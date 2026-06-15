"use client"
import { ActionModal } from "@/shared/components/form/action-modal";
import QuickActionsButton from "@/shared/components/form/quick-action-button";
import { AlertDialogCustom } from "@/shared/components/ui/alert-dialog-custom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { AlignVerticalSpaceBetweenIcon, CalendarOff, CalendarRange, CalendarX, CandyCaneIcon, Plus } from "lucide-react";
import { ReactNode } from "react";

interface quickActionsType {
    title: string
    description: string
    trigger: ReactNode
    children?: ReactNode
}

export function QuickActions() {

    const quickActions: quickActionsType[] = [
        {
            title: 'Crear cita manualmente',
            description: '',
            trigger: <QuickActionsButton label="Nueva Cita Manual" Icon={Plus} />,
        },
        {
            title: 'Bloquear Día / Horario',
            description: '',
            trigger: <QuickActionsButton variant="outline" label="Bloquear Día / Horario" Icon={CalendarOff} />,
        },
        {
            title: 'Bloquear Periodo',
            description: '',
            trigger: <QuickActionsButton variant="outline" label="Bloquear Periodo" Icon={CalendarRange} />,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Quick actions
                </CardTitle>
                <CardDescription>
                    Create, cancel, create block time
                </CardDescription>
                <Separator className="my-4" />
                <CardContent className="space-y-2 px-0">
                    {/**TODO quick actions */}
                    {quickActions.map(action => (
                        <ActionModal
                            key={action.title}
                            title={action.title}
                            description={action.description}
                            trigger={action.trigger}
                        >
                            {action.children}
                        </ActionModal>
                    ))}
                    <Separator className="my-4" />
                    <AlertDialogCustom 
                        fullWith
                        action={() => console.log('cancel')}
                        actionLabel="Cancell all day"
                        dialogTitle="Are you sure you want to cancel?"
                        triggerLabel="Cancell all day"
                        dialogDescription="If you regret it you'll need to change every state manually"
                        showText
                        triggerIcon={CalendarX}
                    />
                </CardContent>
            </CardHeader>
        </Card>
    )
}