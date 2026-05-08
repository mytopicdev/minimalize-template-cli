import { Route, Switch } from 'wouter'
import { LoginPage } from '@/features/auth'
import { HomePage } from '@/features/home'

export function PrivateRouter() {
  return (
    <Switch>
      <Route path='/' component={HomePage} />
    </Switch>
  )
}

export function PublicRouter() {
  return (
    <Switch>
      <Route path='/' component={LoginPage} />
    </Switch>
  )
}
