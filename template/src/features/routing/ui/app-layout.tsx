import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}
