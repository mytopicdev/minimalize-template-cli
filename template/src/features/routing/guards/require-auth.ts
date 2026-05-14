import { redirect, type LoaderFunction } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { PATHS } from '@/features/routing/paths'

export const requireAuth: LoaderFunction = () => {
  if (!useAuthStore.getState().isAuthenticated) {
    return redirect(PATHS.LOGIN)
  }
  return null
}
