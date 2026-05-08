import { PrivateRouter, PublicRouter } from './router'
import { useAuthStore } from '@/features/auth'

function App() {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) return <PrivateRouter />

  return <PublicRouter />
}

export default App
