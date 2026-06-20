import { Outlet } from 'react-router-dom'

import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { TenantHeader } from '@/components/tenant/TenantHeader'
import { TenantSidebar } from '@/components/tenant/TenantSidebar'

export function TenantLayout() {
  return (
    <div className="min-h-screen bg-[#eeeeef] pb-20 sm:pb-0">
      <TenantHeader />
      <div className="flex w-full gap-3 px-3 py-4 sm:px-4 lg:gap-4 lg:px-5">
        <TenantSidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav variant="tenant" />
    </div>
  )
}
