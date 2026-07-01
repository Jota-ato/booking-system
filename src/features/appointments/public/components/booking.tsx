"use client"
import { ServiceWithExtras } from "@/features/services/types/service.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { AnimatePresence, motion } from "motion/react"
import { ServiceSelection } from "./service-selection"
import { useBookingStore } from "../store/booking-store"
import { Agenda } from "../../core/components/agenda"
import { Appointment } from "@/db/schema"
import { TZDate } from "@date-fns/tz"
import { Progress } from "@/shared/components/ui/progress"
import { useEffect, useState } from "react"
import { BackLinkBooking } from "./back-link-booking"
import { CustomerForm } from "./customer-form"
import { ExtrasSelection } from "./extras-selection"

export function Booking({
    services,
    appointments,
    today
}: {
    services: ServiceWithExtras[]
    appointments: Appointment[]
    today: TZDate
}) {

    const { step, setStep } = useBookingStore()
    const [introHasAppeared, setIntroHasAppeared] = useState(false)
    const [showIntro, setShowIntro] = useState(true)

    useEffect(() => {
        if (step !== 2) {
            setShowIntro(true)
            return
        }
        const timer = setTimeout(() => {
            setShowIntro(false)
            setIntroHasAppeared(true)
        }, 1500)
        return () => clearTimeout(timer)
    }, [step])

    const titles: Record<number, string> = {
        1: "Select a service",
        2: "Select a time slot",
        3: "How can we contact you?",
        4: "Would you like some extras?"
    }

    return (
        <Card className="min-h-100">
            <CardHeader>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <CardTitle className="text-center text-2xl flex items-center justify-center gap-4">
                        {step > 1 && (
                            <BackLinkBooking
                                callBack={() => setStep(step - 1)}
                            />
                        )}
                        {titles[step]}
                    </CardTitle>
                    <Progress
                        className="my-4 h-px"
                        value={(step - 1) / 3 * 100}
                    />
                </motion.div>
            </CardHeader>
            <CardContent>
                {step === 1 && (
                    <ServiceSelection
                        services={services}
                    />
                )}
                {step === 2 && (
                    <div className="flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {(showIntro && !introHasAppeared) ? (
                                <motion.p
                                    key="intro-text"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="text-center text-lg mb-4"
                                >
                                    Great! Now select a time slot for your appointment.
                                </motion.p>
                            ) : (
                                <motion.div
                                    className="w-full"
                                    key="agenda"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <Agenda events={appointments} today={today} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
                {step === 3 && (
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <CustomerForm />
                    </motion.div>
                )}
                {step === 4 && (
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <ExtrasSelection />
                    </motion.div>
                )}
            </CardContent>
        </Card>
    )
}