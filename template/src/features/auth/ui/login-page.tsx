import { useAuthStore } from '../state/use-auth-store'

export function LoginPage() {
  const { login } = useAuthStore()

  return (
    <div>
      <p> Hi! Im the LoginPage component! </p>
      <button onClick={login}>Login</button>
    </div>
  )
}
