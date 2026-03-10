import { create } from "zustand";

interface ProjectState {
  activeProjectId: string | null;
  activeProjectName: string;
  setActiveProject: (id: string, name: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  activeProjectId: null,
  activeProjectName: "No project selected",
  setActiveProject: (id, name) => set({ activeProjectId: id, activeProjectName: name }),
}));
