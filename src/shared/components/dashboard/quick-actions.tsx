"use client"
import { Service } from "@/db/schema";
import { cancellAllDayAction } from "@/features/appointments/actions/appointment-actions";
import { BlockTimeForm } from "@/features/appointments/components/block-time-form";
import { NewAppointmentManuallyForm } from "@/features/appointments/components/new-appointment-manual";
import { ActionModal } from "@/shared/components/form/action-modal";
import QuickActionsButton from "@/shared/components/form/quick-action-button";
import { AlertDialogCustom } from "@/shared/components/ui/alert-dialog-custom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { showResponse } from "@/shared/lib/client-actions";
import { CalendarOff, CalendarRange, CalendarX, Plus } from "lucide-react";
import { ReactNode } from "react";

interface quickActionsType {
    title: string
    description: string
    trigger: ReactNode
    children?: ReactNode
}

export function QuickActions({
    services,
    today
}: {
    services: Service[]
    today: Date
}) {

    const quickActions: quickActionsType[] = [
        {
            title: 'Create new appointment manually',
            description: '',
            trigger: <QuickActionsButton label="New manual appointment" Icon={Plus} />,
            children: <NewAppointmentManuallyForm services={services} />
        },
        {
            title: 'Block day / time',
            description: '',
            trigger: <QuickActionsButton variant="outline" label="Block day / time" Icon={CalendarOff} />,
            children: <BlockTimeForm />
        },
        {
            title: 'Block period',
            description: '',
            trigger: <QuickActionsButton variant="outline" label="Block period" Icon={CalendarRange} />,
        },
    ];

    const cancelAllDay = async () => {
        const success = showResponse(await cancellAllDayAction(today))
    }

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
                        action={cancelAllDay}
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