import useAuthStore from '@/stores/auth'

export default function HomePage() {
  const { logout } = useAuthStore()
  return (
    <div>
      <p> Hi! Im the HomePage component! </p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
