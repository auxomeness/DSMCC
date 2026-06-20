import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FilePenLine,
  Filter,
  History,
  RotateCcw,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react'

import { TenantPageIntro } from '@/components/tenant/TenantPageIntro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

const filters = ['All', 'Submitted', 'In Progress', 'Waiting Approval', 'Closed']

const requests = [
  {
    assignedStaff: 'Xian Humphrey',
    category: 'Plumbing',
    id: 'EC-102',
    location: 'Unit 12B - Kitchen Sink Area',
    office: 'Plumbing Office',
    schedule: 'Jun 22, 2026 - 10:00 AM',
    status: 'In Progress',
    title: 'Leaking Faucet',
    type: 'Concern',
    updated: '2 hours ago',
  },
  {
    assignedStaff: 'Unassigned',
    category: 'Administrative Inquiry',
    id: 'AP-044',
    location: 'Administration Office',
    office: 'Administration Office',
    schedule: 'Jun 29, 2026 - 2:30 PM',
    status: 'Submitted',
    title: 'Document Follow-up',
    type: 'Appointment',
    updated: 'Yesterday',
  },
  {
    assignedStaff: 'Austin Pavs',
    category: 'Facility Maintenance',
    id: 'EC-098',
    location: 'Hallway near Elevator A',
    office: 'Maintenance Office',
    schedule: 'Jun 14, 2026 - 9:00 AM',
    status: 'Waiting Approval',
    title: 'Hallway Light Flickering',
    type: 'Concern',
    updated: 'Jun 18',
  },
  {
    assignedStaff: 'Gattouz',
    category: 'Electrical',
    id: 'EC-088',
    location: 'Unit 12B - Bedroom Outlet',
    office: 'Electrical Office',
    schedule: 'Jun 2, 2026 - 1:30 PM',
    status: 'Closed',
    title: 'AC Maintenance',
    type: 'Concern',
    updated: 'Jun 12',
  },
]

const selectedRequest = requests[0]

const timeline = [
  {
    actor: 'Tenant',
    label: 'Concern Created',
    time: 'Jun 20, 2026 - 8:00 AM',
  },
  {
    actor: 'Plumbing Office',
    label: 'Accepted by Office',
    time: 'Jun 20, 2026 - 9:30 AM',
  },
  {
    actor: 'Office Coordinator',
    label: 'Assigned to Staff: Juan Dela Cruz',
    time: 'Jun 20, 2026 - 10:00 AM',
  },
  {
    actor: 'Assigned Staff',
    label: 'Status Updated: In Progress',
    time: 'Jun 20, 2026 - 12:10 PM',
  },
]

const summary = [
  { label: 'Open Requests', value: '3' },
  { label: 'Waiting Approval', value: '1' },
  { label: 'Closed This Month', value: '2' },
]

export function ViewRequestsPage() {
  return (
    <div className="pb-4">
      <TenantPageIntro eyebrow="Concern Center" title="Search concerns, requests, and history" />

      <div>
        <section className="grid gap-3 sm:grid-cols-3">
          {summary.map((item) => (
            <article
              className="rounded-lg border-l-3 border-[#d65b2b] bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]"
              key={item.label}
            >
              <div className="text-2xl font-bold text-slate-950">{item.value}</div>
              <div className="mt-1 text-xs text-slate-500">{item.label}</div>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-11 bg-[#fafafa] pl-9"
                placeholder="Search by request ID, concern title, office, or location"
                type="search"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 shrink-0 text-[#d65b2b]" />
              {filters.map((filter, index) => (
                <Button
                  className={cn(
                    'h-9 shrink-0 rounded-lg px-3 text-xs font-bold',
                    index === 0
                      ? 'bg-[#d65b2b] text-white hover:bg-[#c64f23]'
                      : 'bg-[#fff3ed] text-[#d65b2b] hover:bg-[#fbd9c7]',
                  )}
                  key={filter}
                  type="button"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-3">
            {requests.map((request) => (
              <article
                className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]"
                key={request.id}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#fff3ed] px-2 py-1 text-[10px] font-bold text-[#d65b2b]">
                        {request.id}
                      </span>
                      <StatusBadge status={request.status} />
                      <span className="text-xs font-semibold text-slate-400">{request.type}</span>
                    </div>
                    <h2 className="mt-3 text-base font-bold text-slate-950">{request.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{request.category}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      className="h-9 rounded-lg bg-[#fff3ed] px-3 text-xs font-bold text-[#d65b2b] hover:bg-[#fbd9c7]"
                      type="button"
                    >
                      <History className="h-4 w-4" />
                      Timeline
                    </Button>
                    <Button
                      className="h-9 rounded-lg bg-[#f19a54] px-3 text-xs font-bold text-white hover:bg-[#eb934a]"
                      type="button"
                    >
                      <FilePenLine className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                  <RequestMeta icon={ShieldCheck} label="Office" value={request.office} />
                  <RequestMeta icon={CalendarDays} label="Schedule" value={request.schedule} />
                  <RequestMeta icon={Clock} label="Updated" value={request.updated} />
                  <RequestMeta icon={History} label="Staff" value={request.assignedStaff} />
                </dl>

                <p className="mt-4 rounded-lg bg-[#fafafa] px-3 py-2 text-xs font-medium text-slate-600">
                  {request.location}
                </p>

                {request.status === 'Waiting Approval' ? (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                      className="h-10 rounded-lg bg-[#d65b2b] px-4 text-sm font-bold text-white hover:bg-[#c64f23]"
                      type="button"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve Resolution
                    </Button>
                    <Button
                      className="h-10 rounded-lg bg-[#626060] px-4 text-sm font-bold text-white hover:bg-[#4f4d4d]"
                      type="button"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Request Rework
                    </Button>
                  </div>
                ) : null}

                {request.status === 'Submitted' ? (
                  <div className="mt-4">
                    <Button
                      className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      type="button"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel Request
                    </Button>
                  </div>
                ) : null}
              </article>
            ))}
          </section>

          <aside className="space-y-4" id="concern-history">
            <section className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Selected Request
                  </p>
                  <h2 className="mt-1 text-base font-bold text-slate-950">
                    {selectedRequest.title}
                  </h2>
                </div>
                <StatusBadge status={selectedRequest.status} />
              </div>

              <dl className="mt-4 space-y-3 text-sm">
                <DetailRow label="Request ID" value={selectedRequest.id} />
                <DetailRow label="Office" value={selectedRequest.office} />
                <DetailRow label="Assigned Staff" value={selectedRequest.assignedStaff} />
                <DetailRow label="Schedule" value={selectedRequest.schedule} />
                <DetailRow label="Location" value={selectedRequest.location} />
              </dl>
            </section>

            <section className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <History className="h-4 w-4 text-[#d65b2b]" />
                Concern Timeline
              </div>
              <ol className="mt-4 space-y-4">
                {timeline.map((event, index) => (
                  <li className="flex gap-3" key={`${event.label}-${event.time}`}>
                    <span
                      className={cn(
                        'mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                        index === timeline.length - 1
                          ? 'bg-[#d65b2b] text-white'
                          : 'bg-[#fff3ed] text-[#d65b2b]',
                      )}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-950">{event.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{event.time}</p>
                      <p className="mt-1 text-xs font-semibold text-[#d65b2b]">{event.actor}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === 'Closed'
      ? 'bg-slate-100 text-slate-600'
      : status === 'Waiting Approval'
        ? 'bg-[#fff3ed] text-[#d65b2b]'
        : status === 'In Progress'
          ? 'bg-[#d65b2b] text-white'
          : 'bg-[#f19a54] text-white'

  return (
    <span className={cn('rounded-full px-2 py-1 text-[10px] font-bold', className)}>
      {status}
    </span>
  )
}

function RequestMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: string
}) {
  return (
    <div className="flex gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#d65b2b]" />
      <div>
        <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</dt>
        <dd className="mt-1 text-xs font-semibold text-slate-700">{value}</dd>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-semibold text-slate-700">{value}</dd>
    </div>
  )
}
