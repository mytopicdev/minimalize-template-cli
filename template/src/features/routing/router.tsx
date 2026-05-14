import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage, loginLoader, loginAction } from '@/features/auth'
import { HomePage, homeLoader, homeAction } from '@/features/home'
import { AppLayout } from './ui/app-layout'
import { AuthLayout } from './ui/auth-layout'
import { requireAuth } from './guards/require-auth'
import { redirectIfAuth } from './guards/redirect-if-auth'
import { PATHS } from './paths'

export const appRouter = createBrowserRouter([
  {
    element: <AuthLayout />,
    loader: redirectIfAuth,
    children: [
      {
        path: PATHS.LOGIN,
        element: <LoginPage />,
        loader: loginLoader,
        action: loginAction,
      },
    ],
  },
  {
    element: <AppLayout />,
    loader: requireAuth,
    children: [
      {
        path: PATHS.ROOT,
        element: <HomePage />,
        loader: homeLoader,
        action: homeAction,
      },
    ],
  },
  { path: '*', element: <Navigate to={PATHS.ROOT} replace /> },
])
