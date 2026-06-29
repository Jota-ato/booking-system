import { ServiceWithExtras } from "@/features/services/types/service.types"
import { Heading } from "@/shared/components/typography/heading"
import Image from "next/image"

export function ServiceImage({
    service
}: {
    service: ServiceWithExtras
}) {
    return (
        <div className="relative aspect-square">
            <Image
                src={service.data.image!}
                alt={`Image of ${service.data.name}`}
                width={400}
                height={300}
                className="rounded-md object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-end">
                <div className="bg-black/80 w-full p-4 min-h-30 rounded-b-md">
                    <Heading
                        level={3}
                        className="text-left capitalize"
                    >
                        {service.data.name}
                    </Heading>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {service.data.description}.
                    </p>
                </div>
            </div>
        </div>
    )
}