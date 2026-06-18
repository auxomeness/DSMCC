import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { routeConfig } from '@/routes/routeConfig'
import { type Role } from '@/types/auth'

type RoleRouteProps = {
  allowedRoles: Role[]
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const location = useLocation()
  const { accessToken, user } = useAuth()

  if (!accessToken) {
    return <Navigate to={routeConfig.login} replace state={{ from: location }} />
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={routeConfig.unauthorized} replace />
  }

  return <Outlet />
}
