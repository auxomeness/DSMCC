import {
  ClipboardList,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  UserRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { routeConfig } from '@/routes/routeConfig'
import { cn } from '@/utils/cn'

const tenantNavItems = [
  { icon: Home, label: 'Home', to: routeConfig.tenantDashboard },
  { icon: ClipboardList, label: 'View Requests', to: routeConfig.tenantRequests },
  { icon: MessageSquare, label: 'Tenant Feedback', to: routeConfig.tenantFeedback },
  { icon: Settings, label: 'Settings', to: routeConfig.tenantSettings },
]

export function TenantSidebar() {
  return (
    <aside className="sticky top-[4.5rem] hidden h-[calc(100vh-5.5rem)] w-[224px] shrink-0 flex-col rounded-lg bg-white p-3 shadow-[0_1px_5px_rgba(15,23,42,0.12)] sm:flex xl:w-[240px]">
      <section className="rounded-lg bg-[#f19a54] p-3 text-white" id="tenant-profile">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#d65b2b]">
          <UserRound className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-bold">Welcome back, Juan!</p>
        <p className="mt-1 text-xs font-semibold text-white/85">Unit 12B</p>
      </section>

      <nav aria-label="Tenant sidebar" className="mt-4 flex flex-1 flex-col gap-2">
        <p className="px-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Workspace
        </p>
        {tenantNavItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition-colors',
                isActive
                  ? 'bg-[#d65b2b] text-white'
                  : 'bg-[#fff3ed] text-[#d65b2b] hover:bg-[#fbd9c7]',
              )
            }
            end={item.to === routeConfig.tenantDashboard}
            key={item.label}
            to={item.to}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        className="mt-4 flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
        to={routeConfig.home}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Logout
      </NavLink>
    </aside>
  )
}
