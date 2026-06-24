import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { formatMXN } from "@/shared/lib/currency"
import Image from "next/image"
import { ServiceWithExtras } from "../types/service.types"
import { ServiceCardAdminButton } from "./service-card-admin-button"

export function ServiceCard({
    service,
    isAdmin = false
}: {
    service: ServiceWithExtras
    isAdmin?: boolean
}) {

    const {
        data,
    } = service

    const {
        image,
        description,
        name,
        price
    } = data

    return (
        <Card>
            <Image
                src={image!}
                alt={`Imagen de ${name}`}
                width={150}
                height={150}
                className="relative z-20 aspect-video h-50 w-full object-cover brightness-90"
            />
            <CardHeader>
                <CardTitle
                    className="text-xl font-bold text-center"
                >{name}</CardTitle>
                <CardDescription>{description}.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
                Precio <span className="font-bold">{formatMXN(+price)}</span>
            </CardContent>
            <CardFooter>
                {isAdmin && <ServiceCardAdminButton service={service} />}
            </CardFooter>
        </Card>
    )
}