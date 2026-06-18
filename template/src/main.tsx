import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { appRouter } from '@/features/routing'
import { ReloadPrompt } from '@/common/pwa/reload-prompt'
import { InstallPrompt } from '@/common/pwa/install-prompt'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
    <ReloadPrompt />
    <InstallPrompt />
  </StrictMode>,
)
