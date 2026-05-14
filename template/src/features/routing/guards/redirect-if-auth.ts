import { redirect, type LoaderFunction } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { PATHS } from '@/features/routing/paths'

export const redirectIfAuth: LoaderFunction = () => {
  if (useAuthStore.getState().isAuthenticated) {
    return redirect(PATHS.ROOT)
  }
  return null
}
