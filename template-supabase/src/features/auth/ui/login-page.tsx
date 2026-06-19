import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authProvider } from '@/common/providers/auth'
import { PATHS } from '@/features/routing'
import { cn } from '@/common/utils/cn'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await authProvider.signInWithPassword(email, password)
      navigate(PATHS.ROOT)
    } catch {
      setError('Unable to sign in. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-700"
      >
        <h1 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Sign in</h1>
        <div className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          className={cn(
            'mt-4 w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white',
            'hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200',
          )}
        >
          Sign in
        </button>
        {/* OAuth providers — uncomment after configuring in Supabase dashboard.
            You'll also need to import `supabase` from '@/common/providers/supabase-client':
        <button
          type="button"
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          Continue with GitHub
        </button>
        */}
      </form>
    </div>
  )
}
