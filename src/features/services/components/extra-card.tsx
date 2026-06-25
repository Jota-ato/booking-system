"use client"
import { Extra } from "@/db/schema"
import { Button } from "@/shared/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatMXN } from "@/shared/lib/currency";
import { useExtraStore } from "../stores/extra-store";

export function ExtraCard({
    extra
}: {
    extra: Extra
}) {

    const { setActiveExtra, toggleOpen } = useExtraStore()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="line-clamp-1">{extra.name}</CardTitle>
                <CardDescription className="line-clamp-1">{extra.description}</CardDescription>
            </CardHeader>
            <CardContent>
                Price: <span className="font-bold">{formatMXN(+extra.price)}</span>
                <CardAction>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setActiveExtra(extra)
                            toggleOpen()
                        }}
                    >
                        Edit
                    </Button>
                </CardAction>
            </CardContent>
        </Card>
    )
}