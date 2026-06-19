import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}))
