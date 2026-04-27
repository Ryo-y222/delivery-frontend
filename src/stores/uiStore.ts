import { create } from "zustand";
import type { UserRole } from "../mocks/types/common";

interface UIState {
    currentRole: UserRole;
    setCurrentRole: (role: UserRole) => void;
}

export const useUIStore = create<UIState>((set) => ({
    currentRole: "transport_company",
    setCurrentRole: (role) => set({ currentRole: role}),
}));