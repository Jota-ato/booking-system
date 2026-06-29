"use client"
import { ServiceWithExtras } from "@/features/services/types/service.types"
import { ScrollAnimateItem } from "@/shared/components/animate/scroll-animate-item"
import { Heading } from "@/shared/components/typography/heading"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { motion } from "motion/react"
import Image from "next/image"
import { ServiceImage } from "./service-image"
import { ServiceSelection } from "./service-selection"

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
                <ServiceSelection
                    services={services}
                />
            </CardContent>
        </Card>
    )
}