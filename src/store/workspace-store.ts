import { create } from "zustand";

type WorkspaceStore = {
  sidebarCollapsed: boolean;

  toggleSidebar: () => void;

  setSidebarCollapsed: (
    value: boolean
  ) => void;
};

export const useWorkspaceStore =
  create<WorkspaceStore>(
    (set) => ({
      sidebarCollapsed: false,

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed:
            !state.sidebarCollapsed,
        })),

      setSidebarCollapsed: (
        value
      ) =>
        set({
          sidebarCollapsed:
            value,
        }),
    })
  );