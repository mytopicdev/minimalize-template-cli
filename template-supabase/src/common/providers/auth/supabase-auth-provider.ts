import type { AuthProvider, AuthSession } from '@/common/providers/auth/auth-provider'
import { supabase } from '@/common/providers/supabase-client'

function toAuthSession(session: { user: { id: string; email?: string | null } } | null): AuthSession | null {
  if (!session) return null
  return { userId: session.user.id, email: session.user.email ?? null }
}

export const supabaseAuthProvider: AuthProvider = {
  async getSession() {
    const { data } = await supabase.auth.getSession()
    return toAuthSession(data.session)
  },

  async signInWithPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw new Error(error.message)
    }
    return toAuthSession(data.session) as AuthSession
  },

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      throw new Error(error.message)
    }
    if (!data.session) {
      throw new Error('Check your email to confirm your account')
    }
    return toAuthSession(data.session) as AuthSession
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  },

  onAuthChange(callback) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(toAuthSession(session))
    })
    return () => data.subscription.unsubscribe()
  },
}
