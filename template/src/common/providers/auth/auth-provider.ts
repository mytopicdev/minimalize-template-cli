export interface AuthSession {
  userId: string
  email: string | null
}

export interface AuthProvider {
  getSession(): Promise<AuthSession | null>
  signInWithPassword(email: string, password: string): Promise<AuthSession>
  signUp(email: string, password: string): Promise<AuthSession>
  signOut(): Promise<void>
  onAuthChange(callback: (session: AuthSession | null) => void): () => void
}
