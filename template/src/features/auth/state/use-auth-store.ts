import { create } from 'zustand'
import type { AuthSession } from '@/common/providers/auth'

interface AuthStore {
  session: AuthSession | null
  isAuthenticated: boolean
  setSession: (session: AuthSession | null) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  session: null,
  isAuthenticated: false,
  setSession: (session) => set({ session, isAuthenticated: session !== null }),
}))
