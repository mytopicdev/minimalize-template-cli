import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { PATHS } from '@/features/routing'

export function HomePage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate(PATHS.LOGIN)
  }

  return (
    <div>
      <p> Hi! Im the HomePage component! </p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
