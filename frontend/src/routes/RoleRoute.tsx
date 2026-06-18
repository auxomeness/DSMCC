import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { routeConfig } from '@/routes/routeConfig'
import { type Role } from '@/types/auth'

type RoleRouteProps = {
  allowedRoles: Role[]
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={routeConfig.unauthorized} replace />
  }

  return <Outlet />
}
