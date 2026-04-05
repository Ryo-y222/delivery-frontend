import { create } from "zustand";

interface ToastState {
  message: string;
  type: "success" | "error";
}

interface AppState {
  page: "auth" | "dashboard";
  tab: "login" | "register";
  toast: ToastState | null;
  setPage: (page: AppState["page"]) => void;
  setTab: (tab: AppState["tab"]) => void;
  showToast: (message: string, type?: "success" | "error") => void;
  hideToast: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  page: "auth",
  tab: "login",
  toast: null,
  setPage: (page) => set({ page }),
  setTab: (tab) => set({ tab }),
  showToast: (message, type = "success") => {
  set({ toast: { message, type } });
  },
  hideToast: () => set({ toast: null }),
}));