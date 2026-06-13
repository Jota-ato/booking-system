import { create } from "zustand"
import { FullAppointment } from "../types/appointments.types"

export type AppointmentStore = {
    open: boolean
    toggleOpen: () => void
    activeAppointment?: FullAppointment
    setActiveAppointment: (appointment?: FullAppointment) => void
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
    open: false,
    toggleOpen: () => set({open: !get().open}),
    activeAppointment: undefined,
    setActiveAppointment: (appointment?: FullAppointment) => set({activeAppointment: appointment})
}))