import {
  Bell,
  CalendarDays,
  Plus,
} from 'lucide-react'
import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { InteractiveCalendar } from '@/components/tenant/InteractiveCalendar'
import { TenantPageIntro } from '@/components/tenant/TenantPageIntro'
import { Button } from '@/components/ui/button'
import { routeConfig } from '@/routes/routeConfig'
import { cn } from '@/utils/cn'

const quickActions = [
  { icon: Plus, label: 'Create Concern', to: routeConfig.tenantCreateConcern },
  { icon: Plus, label: 'Create Feedback', to: routeConfig.tenantCreateFeedback},
  { icon: CalendarDays, label: 'Schedule Appointment', to: routeConfig.tenantScheduleAppointment },
]

const metrics = [
  { label: 'Active Concerns', value: '3' },
  { label: 'Scheduled Appointments', value: '1' },
  { label: 'Total Requests', value: '7' },
  { label: 'Resolved This Month', value: '2' },
]

const concerns = [
  {
    title: 'Leaking Faucet',
    meta: 'Unit 12B - Submitted Jun 14',
    status: 'In Progress',
    className: 'bg-[#d65b2b] text-white',
    badgeClassName: 'bg-white/25 text-white',
  },
  {
    title: 'Hallway Light Flickering',
    meta: 'Submitted Jun 10',
    status: 'Pending',
    className: 'bg-[#626060] text-white',
    badgeClassName: 'bg-white/25 text-white',
  },
  {
    title: 'AC Maintenance',
    meta: 'Submitted Jun 2',
    status: 'Resolved',
    className: 'bg-[#ee8d48] text-white',
    badgeClassName: 'bg-white/25 text-white',
  },
]

const appointments = [
  {
    date: '2026-06-22',
    day: '22',
    title: 'Maintenance Office - Site visit',
    detail: '10:00 AM - Ground Floor',
  },
  {
    date: '2026-06-29',
    day: '29',
    title: 'Admin Office - Document follow-up',
    detail: '2:30 PM - 2nd Floor',
  },
]

const updates = [
  {
    title: 'Your concern "Leaking faucet" was updated to In Progress.',
    time: '2 hours ago',
  },
  {
    title: 'Appointment confirmed with Maintenance Office.',
    time: 'Yesterday',
  },
  {
    title: 'Your concern "AC maintenance request" was marked Resolved.',
    time: 'Jun 12',
  },
]

const reminders = [
  {
    title: 'Site visit - Maintenance Office',
    time: '22 Jun, 2026 - 10:00 AM',
  },
  {
    title: 'Follow up on AC request',
    time: '24 Jun, 2026',
  },
  {
    title: 'Document follow-up - Admin Office',
    time: '29 Jun, 2026 - 2:30 PM',
  },
]

export function TenantDashboardPage() {
  return (
    <div className="pb-4">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <TenantPageIntro eyebrow="Tenant Home" title="Your Dashboard" />

        <div className="flex flex-wrap justify-end gap-2">
          {quickActions.map((action) => (
            <Button
              asChild
              className="h-10 rounded-lg bg-[#d65b2b] px-4 text-sm font-bold text-white hover:bg-[#c64f23]"
              key={action.label}
            >
              <Link to={action.to}>
                <action.icon className="h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <article
              className="rounded-lg border-l-3 border-[#d65b2b] bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]"
              key={metric.label}
            >
              <div className="text-2xl font-bold text-slate-950">{metric.value}</div>
              <p className="mt-1 text-xs text-slate-500">{metric.label}</p>
            </article>
          ))}
        </section>

        <section className="mt-4" id="tenant-concerns">
          <h2 className="text-sm font-bold text-slate-950">Active Concerns</h2>
          <div className="mt-2 grid gap-3 lg:grid-cols-3">
            {concerns.map((concern) => (
              <article
                className={cn('min-h-20 rounded-lg p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]', concern.className)}
                key={concern.title}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold">{concern.title}</h3>
                  <span className={cn('rounded-full px-2 py-1 text-[10px] font-bold', concern.badgeClassName)}>
                    {concern.status}
                  </span>
                </div>
                <p className="mt-7 text-xs font-semibold opacity-90">{concern.meta}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 grid gap-3 xl:grid-cols-2">
          <DashboardPanel title="Scheduled Appointments" id="tenant-appointments">
            <div className="space-y-0">
              {appointments.map((appointment) => (
                <div
                  className="flex gap-4 border-b border-slate-200 py-4 last:border-b-0"
                  key={appointment.title}
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-[#fff3ed] text-[#d65b2b]">
                    <span className="text-base font-bold leading-none">{appointment.day}</span>
                    <span className="mt-1 text-[10px] font-bold">
                      {formatMonthShort(appointment.date)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-950">{appointment.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{appointment.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel title="Calendar">
            <InteractiveCalendar
              markers={appointments.map((appointment) => ({
                date: appointment.date,
                label: appointment.title,
              }))}
              selectedDate="2026-06-20"
            />
          </DashboardPanel>
        </section>

        <section className="mt-4 grid gap-3 xl:grid-cols-2">
          <DashboardPanel title="Recent Updates">
            <div className="divide-y divide-slate-200">
              {updates.map((update) => (
                <div className="flex gap-3 py-3" key={update.title}>
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#d65b2b]" />
                  <div>
                    <p className="text-sm text-slate-700">{update.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel title="Reminders">
            <div className="divide-y divide-slate-200">
              {reminders.map((reminder) => (
                <div className="flex gap-3 py-3" key={reminder.title}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff3ed] text-[#d65b2b]">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">{reminder.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{reminder.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardPanel>
        </section>
    </div>
  )
}

function formatMonthShort(date: string) {
  return new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(`${date}T00:00:00`)).toUpperCase()
}

function DashboardPanel({
  children,
  id,
  title,
}: {
  children: ReactNode
  id?: string
  title: string
}) {
  return (
    <article className="rounded-lg bg-white p-5 shadow-[0_1px_5px_rgba(15,23,42,0.12)]" id={id}>
      <h2 className="text-sm font-bold text-slate-950">{title}</h2>
      <div className="mt-3">{children}</div>
    </article>
  )
}
