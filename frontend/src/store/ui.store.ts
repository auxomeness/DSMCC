import { create } from 'zustand'

type UiState = {
  isSidebarCollapsed: boolean
  setSidebarCollapsed: (isSidebarCollapsed: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarCollapsed: false,
  setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
}))
