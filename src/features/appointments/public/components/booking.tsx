"use client"
import { ServiceWithExtras } from "@/features/services/types/service.types"
import { ScrollAnimateItem } from "@/shared/components/animate/scroll-animate-item"
import { Heading } from "@/shared/components/typography/heading"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { motion } from "motion/react"
import Image from "next/image"
import { ServiceImage } from "./service-image"

export function Booking({
    services
}: {
    services: ServiceWithExtras[]
}) {
    return (
        <Card>
            <CardHeader>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <CardTitle className="text-center text-2xl">
                        Select your service
                    </CardTitle>
                </motion.div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:grid-cols-3">
                    {services.length ?
                        services.map((service, idx) => (
                            <ScrollAnimateItem key={service.data.id} delay={Math.min(idx * 0.1, 0.4)}>
                                <li key={service.data.id}>
                                    <ServiceImage
                                        service={service}
                                    />
                                </li>
                            </ScrollAnimateItem>
                        ))
                        : (
                            <p className="text-center text-muted-foreground">
                                No services available.
                            </p>
                        )
                    }
                </ul>
            </CardContent>
        </Card>
    )
}