import { create } from "zustand";
import { Extra } from "@/db/schema";

interface ExtraStore {
    open: boolean
    toggleOpen: () => void
    activeExtra: Extra | null
    setActiveExtra: (extra: Extra | null) => void
}

export const useExtraStore = create<ExtraStore>((set) => ({
    open: false,
    toggleOpen: () => set((state) => ({ open: !state.open })),
    activeExtra: null,
    setActiveExtra: (extra: Extra | null) => set({ activeExtra: extra })
}))