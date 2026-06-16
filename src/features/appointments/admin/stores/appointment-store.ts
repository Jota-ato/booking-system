import { create } from "zustand"
import { FullAppointment } from "../../core/types/appointments.types"

export type AppointmentStore = {
    editDialogOpen: boolean
    createDialogOpen: boolean
    toggleCreateDialogOpen: () => void
    activeCreateAppointmentTime?: { startTime: Date, endTime: Date }
    setActiveCreateAppointmentTime: (time?: { startTime: Date, endTime: Date }) => void
    toggleEditDialogOpen: () => void
    activeEditingAppointment?: FullAppointment
    setActiveEditingAppointment: (appointment?: FullAppointment) => void
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
    editDialogOpen: false,
    createDialogOpen: false,
    toggleCreateDialogOpen: () => set({createDialogOpen: !get().createDialogOpen}),
    toggleEditDialogOpen: () => set({editDialogOpen: !get().editDialogOpen}),
    activeCreateAppointmentTime: undefined,
    setActiveCreateAppointmentTime: (time?: { startTime: Date, endTime: Date }) => set({activeCreateAppointmentTime: time}),
    activeEditingAppointment: undefined,
    setActiveEditingAppointment: (appointment?: FullAppointment) => set({activeEditingAppointment: appointment})
}))