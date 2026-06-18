import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { routeConfig } from '@/routes/routeConfig'

export function ProtectedRoute() {
  const location = useLocation()
  const { accessToken } = useAuth()

  if (!accessToken) {
    return <Navigate to={routeConfig.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
