"use client"
import { ServiceImage } from "@/features/appointments/public/components/service-image"
import { ServiceWithExtras } from "@/features/services/types/service.types"
import { Heading } from "../../typography/heading"
import { motion, AnimatePresence } from "motion/react"
import { ScrollAnimateItem } from "../../animate/scroll-animate-item"
import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"

export function ServicesSection({
    services
}: {
    services: ServiceWithExtras[]
}) {
    return (
        <AnimatePresence>
            <section className="space-y-4 py-8" id="services">
                <ScrollAnimateItem>
                    <Heading className="text-left" level={2}>Our services</Heading>
                    <p className="text-muted-foreground">Certified technician with over 10 years of experience.</p>
                </ScrollAnimateItem>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service, idx) => (
                        <ScrollAnimateItem
                            key={service.data.id}
                            delay={Math.min(idx * 0.1, 0.4)}
                        >
                            <ServiceImage
                                service={service}
                                trigger={
                                    <Button
                                        variant={"secondary"}
                                    >
                                        See more
                                    </Button>
                                }
                            />
                        </ScrollAnimateItem>
                    ))}
                </div>
            </section>
        </AnimatePresence>
    )
}