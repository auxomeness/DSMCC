import { useNavigate } from 'react-router-dom'

import { routeConfig } from '@/routes/routeConfig'
import { type Role } from '@/types/auth'

const roleHome: Record<Role, string> = {
  ADMIN: routeConfig.adminDashboard,
  STAFF: routeConfig.staffDashboard,
  TENANT: routeConfig.tenantDashboard,
}

export function useRoleRedirect() {
  const navigate = useNavigate()

  return (role: Role) => {
    navigate(roleHome[role], { replace: true })
  }
}
