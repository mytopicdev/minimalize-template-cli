import type { AuthProvider, AuthSession } from './auth-provider'

const STORAGE_KEY = 'auth-session'

function readSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

function writeSession(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

const listeners = new Set<(session: AuthSession | null) => void>()

function notify(session: AuthSession | null) {
  listeners.forEach((listener) => listener(session))
}

export const mockAuthProvider: AuthProvider = {
  async getSession() {
    return readSession()
  },

  async signInWithPassword(email) {
    const session: AuthSession = { userId: crypto.randomUUID(), email }
    writeSession(session)
    notify(session)
    return session
  },

  async signUp(email) {
    const session: AuthSession = { userId: crypto.randomUUID(), email }
    writeSession(session)
    notify(session)
    return session
  },

  async signOut() {
    writeSession(null)
    notify(null)
  },

  onAuthChange(callback) {
    listeners.add(callback)
    return () => listeners.delete(callback)
  },
}
