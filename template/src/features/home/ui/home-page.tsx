import { useAuthStore } from '@/features/auth'

export function HomePage() {
  const { logout } = useAuthStore()
  return (
    <div>
      <p> Hi! Im the HomePage component! </p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
