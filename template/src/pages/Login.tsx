import useAuthStore from '@/stores/auth'

export default function LoginPage() {
  const { login } = useAuthStore()

  return (
    <div>
      <p> Hi! Im the LoginPage component! </p>
      <button onClick={login}>Login</button>
    </div>
  )
}
