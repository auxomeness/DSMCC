import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { StaffLayout } from '@/layouts/StaffLayout'
import { TenantLayout } from '@/layouts/TenantLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { FeedbackPage } from '@/pages/public/FeedbackPage'
import { HomePage } from '@/pages/public/HomePage'
import { LoginPage } from '@/pages/public/LoginPage'
import { RegisterPage } from '@/pages/public/RegisterPage'
import { UnauthorizedPage } from '@/pages/public/UnauthorizedPage'
import { StaffDashboardPage } from '@/pages/staff/StaffDashboardPage'
import { CreateConcernPage } from '@/pages/tenant/CreateConcernPage'
import { ScheduleAppointmentPage } from '@/pages/tenant/ScheduleAppointmentPage'
import { TenantDashboardPage } from '@/pages/tenant/TenantDashboardPage'
import { TenantFeedbackPage } from '@/pages/tenant/TenantFeedbackPage'
import { TenantSettingsPage } from '@/pages/tenant/TenantSettingsPage'
import { ViewRequestsPage } from '@/pages/tenant/ViewRequestsPage'
import { routeConfig } from '@/routes/routeConfig'

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={routeConfig.login} element={<LoginPage />} />
          <Route path={routeConfig.register} element={<RegisterPage />} />
          <Route path={routeConfig.unauthorized} element={<UnauthorizedPage />} />
          <Route path={routeConfig.feedback} element={<FeedbackPage />} />
          <Route path={routeConfig.home} element={<HomePage />} />
        </Route>

        <Route element={<TenantLayout />}>
          <Route path={routeConfig.tenantDashboard} element={<TenantDashboardPage />} />
          <Route path={routeConfig.tenantCreateConcern} element={<CreateConcernPage />} />
          <Route path={routeConfig.tenantScheduleAppointment} element={<ScheduleAppointmentPage />} />
          <Route path={routeConfig.tenantRequests} element={<ViewRequestsPage />} />
          <Route path={routeConfig.tenantFeedback} element={<TenantFeedbackPage />} />
          <Route path={routeConfig.tenantSettings} element={<TenantSettingsPage />} />
        </Route>

        <Route element={<StaffLayout />}>
          <Route path={routeConfig.staffDashboard} element={<StaffDashboardPage />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path={routeConfig.adminDashboard} element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to={routeConfig.login} replace />} />
      </Routes>
    </Router>
  )
}
