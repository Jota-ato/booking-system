"use client"
import { ServiceWithExtras } from "@/features/services/types/service.types"
import { Heading } from "@/shared/components/typography/heading"
import { formatMXN } from "@/shared/lib/currency"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"

export function ServiceImage({ service }: { service: ServiceWithExtras }) {
    const [hovered, setHovered] = useState(false)

    const included = service.serviceExtras.filter(e => e.included)
    const optional = service.serviceExtras.filter(e => !e.included)
    const hasExtras = included.length > 0 || optional.length > 0

    return (
        <div
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Imagen */}
            <Image
                src={service.data.image!}
                alt={`Image of ${service.data.name}`}
                fill
                className="object-cover transition-transform duration-500 ease-out"
                style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
            />

            <div className="absolute inset-0 bg-linear-to-t bg-black/25" />

            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-1 bg-black/70">
                <div className="flex items-center justify-between gap-2 text-accent dark:text-accent-foreground">
                    <Heading
                        level={3}
                        className="capitalize  text-base leading-tight"
                    >
                        {service.data.name}
                    </Heading>
                    <span className="font-semibold text-sm whitespace-nowrap">
                        {formatMXN(+service.data.price)}
                    </span>
                </div>

                <p className="text-xs text-white/70 line-clamp-2">
                    {service.data.description}
                </p>

                <AnimatePresence>
                    {hovered && hasExtras && (
                        <motion.div
                            key="extras"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="overflow-hidde"
                        >
                            <div className="pt-3 flex flex-col gap-3 border-t border-accent dark:border-accent-foreground mt-2">
                                {included.length > 0 && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted dark:text-muted-foreground mb-1">
                                            Included
                                        </p>
                                        <ul className="space-y-0.5">
                                            {included.map(e => (
                                                <li key={e.extra.id} className="flex justify-between text-xs text-white/80">
                                                    <span>{e.extra.name}</span>
                                                    <span className="text-white/50">{formatMXN(+e.extra.price)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {optional.length > 0 && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted dark:text-muted-foreground mb-1">
                                            Add-ons
                                        </p>
                                        <ul className="space-y-0.5">
                                            {optional.map(e => (
                                                <li key={e.extra.id} className="flex justify-between text-xs text-white/80">
                                                    <span>{e.extra.name}</span>
                                                    <span className="text-white/50">{formatMXN(+e.extra.price)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}