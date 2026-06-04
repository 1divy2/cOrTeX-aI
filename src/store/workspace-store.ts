import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Collection = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: number;
};

type WorkspaceStore = {
  sidebarCollapsed: boolean;
  activeCollectionId: string | null;
  collections: Collection[];
  
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  
  setActiveCollection: (id: string | null) => void;
  createCollection: (collection: Omit<Collection, "id" | "createdAt">) => void;
  deleteCollection: (id: string) => void;
};

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeCollectionId: null,
      collections: [
        {
          id: "default-research",
          name: "Research",
          description: "Default workspace for research notes",
          icon: "brain",
          color: "#a855f7",
          createdAt: Date.now(),
        },
        {
          id: "default-personal",
          name: "Personal",
          description: "Personal thoughts and journaling",
          icon: "user",
          color: "#22d3ee",
          createdAt: Date.now(),
        }
      ],

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (value) =>
        set({ sidebarCollapsed: value }),

      setActiveCollection: (id) => set({ activeCollectionId: id }),
      
      createCollection: (collection) => set((state) => ({
        collections: [...state.collections, {
          ...collection,
          id: crypto.randomUUID(),
          createdAt: Date.now()
        }]
      })),
      
      deleteCollection: (id) => set((state) => ({
        collections: state.collections.filter(c => c.id !== id),
        activeCollectionId: state.activeCollectionId === id ? null : state.activeCollectionId
      }))
    }),
    {
      name: "cortex-workspace-storage"
    }
  )
);