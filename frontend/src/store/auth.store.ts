import { create } from 'zustand'

import { type AuthUser } from '@/types/auth'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  clearAuth: () => void
  setAuth: (auth: {
    accessToken: string
    refreshToken: string
    user: AuthUser
  }) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
  setAuth: (auth) => set(auth),
}))
