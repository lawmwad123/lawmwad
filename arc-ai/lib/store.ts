import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session } from "./types";

interface SessionStore {
  session: Session | null;
  userRole: string;
  setSession: (session: Session) => void;
  clearSession: () => void;
  setUserRole: (role: string) => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      session:  null,
      userRole: "analyst",
      setSession:  (session)  => set({ session }),
      clearSession: ()        => set({ session: null }),
      setUserRole: (userRole) => set({ userRole }),
    }),
    { name: "demo-session" }
  )
);

interface UIStore {
  showSql:    boolean;
  darkMode:   boolean;
  sidebarOpen: boolean;
  toggleSql:     () => void;
  toggleDark:    () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      showSql:     false,
      darkMode:    false,
      sidebarOpen: true,
      toggleSql:      () => set((s) => ({ showSql:     !s.showSql })),
      toggleDark:     () => set((s) => ({ darkMode:    !s.darkMode })),
      toggleSidebar:  () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    { name: "demo-ui" }
  )
);
