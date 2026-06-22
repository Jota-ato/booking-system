import { Service } from "@/db/schema"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { formatMXN } from "@/shared/lib/currency"
import Image from "next/image"

export function ServiceCard({
    service,
    isAdmin = false
}: {
    service: Service
    isAdmin?: boolean
}) {

    const {
        description,
        image,
        name,
        price
    } = service

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
                <Button>
                    Ver detalles
                </Button>
            </CardFooter>
        </Card>
    )
}