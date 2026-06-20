import { UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routeConfig } from '@/routes/routeConfig'

import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { PublicNavbar } from '@/components/navigation/PublicNavbar'
import { PublicSidebar } from '@/components/navigation/PublicSidebar'

export function HomePage() {
  return (
    <main className="min-h-screen bg-[#f0f0f0] pb-20 sm:pb-0">
      <PublicNavbar />

      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col gap-0 md:flex-row md:items-start md:gap-4 md:p-6">
        <PublicSidebar />

        <section className="order-first flex-1 bg-[#f0f0f0] p-4 md:order-none md:rounded-lg md:bg-white md:shadow-[0_1px_6px_rgba(0,0,0,0.07)]">
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-[#e8874a] p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#d9691e]">
              <UserRound className="h-5 w-5" />
            </div>
            <div className="min-h-9 flex-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-[#d9691e]">
              Welcome, guest!
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:bg-[#fafafa]">
              <p className="text-xs font-bold uppercase tracking-wide text-[#d9691e]">
                System Introduction
              </p>
              <h1 className="mt-3 text-2xl font-bold text-slate-950 md:text-3xl">
                DECA Sentrio E-Concern and Service Request Portal
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                Submit maintenance concerns, track office handling, vote on public issues, and
                book service appointments through one resident portal.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ['Concerns', 'Report unit and facility issues.'],
                  ['Appointments', 'Reserve office service slots.'],
                  ['Updates', 'Track progress and approvals.'],
                ].map(([title, copy]) => (
                  <div className="rounded-lg bg-white p-4 shadow-sm" key={title}>
                    <h2 className="text-sm font-bold text-slate-900">{title}</h2>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-h-[230px] rounded-lg bg-[#b0b0b0] p-4 text-sm font-semibold text-white">
               <Link to={routeConfig.tenantDashboard}>
              Portal Preview
               </Link>
            </div>
          </div>
        </section>
      </div>

      <MobileBottomNav />
    </main>
  )
}
