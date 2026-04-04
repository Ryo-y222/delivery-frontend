import { create } from "zustand";

interface AppState {
    page: "auth" | "dashboard";
    tab: "login" | "register"
    setPage: (page: AppState["page"]) => void;
    setTab: (tab:AppState["tab"]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  page: "auth",
  tab: "login",
  setPage: (page) => set({ page }),
  setTab: (tab) => set({tab})
}));