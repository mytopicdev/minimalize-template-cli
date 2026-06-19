import { useNavigate } from 'react-router-dom'
import { authProvider } from '@/common/providers/auth'
import { PATHS } from '@/features/routing'

export function HomePage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authProvider.signOut()
    navigate(PATHS.LOGIN)
  }

  return (
    <div>
      <p> Hi! Im the HomePage component! </p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
