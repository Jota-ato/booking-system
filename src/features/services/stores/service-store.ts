import { create } from "zustand";
import { ServiceWithExtras } from "../types/service.types";

interface ServiceStore {
    open: boolean
    toggleOpen: () => void
    activeService: ServiceWithExtras | null
    setActiveService: (service: ServiceWithExtras | null) => void
}

export const useServiceStore = create<ServiceStore>((set) => ({
    open: false,
    toggleOpen: () => set((state) => ({ open: !state.open })),
    activeService: null,
    setActiveService: (service: ServiceWithExtras | null) => set({ activeService: service })
}))