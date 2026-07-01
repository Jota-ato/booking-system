import { ServiceWithExtras } from "@/features/services/types/service.types"
import { create } from "zustand"

interface BookingStore {
    step: number
    setStep: (step: number) => void
    selectedService: ServiceWithExtras | null
    setSelectedService: (service: ServiceWithExtras | null) => void
    selectedExtras: string[]
    addExtra: (extra: string) => void
    removeExtra: (extra: string) => void
    time: { startTime: Date; endTime: Date } | null
    setTime: (time: { startTime: Date; endTime: Date } | null) => void
    user: string | null
    setUser: (userId: string | null) => void
}

export const useBookingStore = create<BookingStore>((set) => ({
    step: 1,
    setStep: (step) => set({ step }),
    selectedService: null,
    setSelectedService: (service) => set({ selectedService: service }),
    selectedExtras: [],
    addExtra: (extra) => set((state) => ({ selectedExtras: [...state.selectedExtras, extra] })),
    removeExtra: (extra) => set((state) => ({ selectedExtras: state.selectedExtras.filter(e => e !== extra) })),
    time: null,
    setTime: (time) => set({ time }),
    user: null,
    setUser: (user) => set({ user }),
}))