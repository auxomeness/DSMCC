import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { StaffLayout } from '@/layouts/StaffLayout'
import { TenantLayout } from '@/layouts/TenantLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { HomePage } from '@/pages/public/HomePage'
import { LoginPage } from '@/pages/public/LoginPage'
import { RegisterPage } from '@/pages/public/RegisterPage'
import { UnauthorizedPage } from '@/pages/public/UnauthorizedPage'
import { StaffDashboardPage } from '@/pages/staff/StaffDashboardPage'
import { TenantDashboardPage } from '@/pages/tenant/TenantDashboardPage'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleRoute } from '@/routes/RoleRoute'
import { routeConfig } from '@/routes/routeConfig'

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={routeConfig.login} element={<LoginPage />} />
          <Route path={routeConfig.register} element={<RegisterPage />} />
          <Route path={routeConfig.unauthorized} element={<UnauthorizedPage />} />
          <Route path={routeConfig.home} element={<HomePage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={['TENANT']} />}>
            <Route element={<TenantLayout />}>
              <Route path={routeConfig.tenantDashboard} element={<TenantDashboardPage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={['STAFF']} />}>
            <Route element={<StaffLayout />}>
              <Route path={routeConfig.staffDashboard} element={<StaffDashboardPage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route element={<AdminLayout />}>
              <Route path={routeConfig.adminDashboard} element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={routeConfig.login} replace />} />
      </Routes>
    </Router>
  )
}
