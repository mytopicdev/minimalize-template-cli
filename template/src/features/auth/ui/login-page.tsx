import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../state/use-auth-store'
import { PATHS } from '@/features/routing'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleLogin = () => {
    login()
    navigate(PATHS.ROOT)
  }

  return (
    <div>
      <p> Hi! Im the LoginPage component! </p>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
