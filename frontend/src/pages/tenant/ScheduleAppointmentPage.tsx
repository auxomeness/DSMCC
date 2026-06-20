import {
  CalendarCheck,
  CalendarDays,
  Clock,
  ClipboardList,
  MapPin,
  UsersRound,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { InteractiveCalendar } from '@/components/tenant/InteractiveCalendar'
import { TenantPageIntro } from '@/components/tenant/TenantPageIntro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { routeConfig } from '@/routes/routeConfig'

const appointmentTypes = [
  'Utility Concern',
  'Service Request',
  'Administrative Inquiry',
  'Billing Concern',
  'Permit Request',
  'Clearance Request',
  'Documentation Request',
  'General Concern',
]

const offices = [
  'Administration Office',
  'Billing Office',
  'Maintenance Office',
  'Water Utility Office',
  'Cleaning Services',
  'Electrical Services',
  'Plumbing Services',
  'Waste Collection',
]

const visitModes = [
  'Face-to-face at administration office',
  'Unit inspection or site visit',
  'Utility service visit',
  'Phone follow-up',
]

const availableSlots = [
  { date: '2026-06-22', day: 'Jun 22', time: '10:00 AM', office: 'Maintenance Office' },
  { date: '2026-06-24', day: 'Jun 24', time: '1:30 PM', office: 'Administration Office' },
  { date: '2026-06-29', day: 'Jun 29', time: '2:30 PM', office: 'Billing Office' },
]

const upcomingAppointments = [
  {
    status: 'Approved',
    title: 'Maintenance Office - Site visit',
    detail: 'Jun 22, 2026 - 10:00 AM',
  },
  {
    status: 'Pending',
    title: 'Administration Office - Document follow-up',
    detail: 'Jun 29, 2026 - 2:30 PM',
  },
]

export function ScheduleAppointmentPage() {
  const [selectedDate, setSelectedDate] = useState('2026-06-22')

  return (
    <div className="pb-4">
      <TenantPageIntro
        eyebrow="Schedule Appointment"
        title="Reserve a service visit or office meeting"
      />

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)] md:p-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <section>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <CalendarCheck className="h-4 w-4 text-[#d65b2b]" />
              Appointment Details
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <SelectField
                label="Appointment Type"
                name="appointmentType"
                options={appointmentTypes}
                required
              />
              <SelectField label="Office or Utility" name="office" options={offices} required />
              <SelectField label="Visit Mode" name="visitMode" options={visitModes} required />
              <Field
                label="Related Request ID"
                name="relatedRequest"
                placeholder="Optional, e.g. EC-102"
              />
            </div>
          </section>

          <section className="mt-5 rounded-lg border border-slate-200 bg-[#fafafa] p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <Clock className="h-4 w-4 text-[#d65b2b]" />
              Date and Time Slot
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <InteractiveCalendar
                markers={availableSlots.map((slot) => ({
                  date: slot.date,
                  label: `${slot.office} - ${slot.time}`,
                }))}
                name="date"
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              <div className="grid content-start gap-4">
                <SelectField
                  label="Time Slot"
                  name="timeSlot"
                  options={['9:00 AM', '10:00 AM', '1:30 PM', '2:30 PM', 'Any available slot']}
                  required
                />
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-lg border border-slate-200 bg-[#fafafa] p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <MapPin className="h-4 w-4 text-[#d65b2b]" />
              Location or Meeting Context
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Field label="Unit or Meeting Location" name="location" placeholder="Unit 12B or Admin Office" />
              <Field label="Contact Number" name="contactNumber" placeholder="09xx xxx xxxx" type="tel" />
            </div>
            <div className="mt-4">
              <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="purpose">
                Purpose
              </Label>
              <textarea
                className="mt-2 min-h-32 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#d65b2b] focus:ring-3 focus:ring-[#d65b2b]/15"
                id="purpose"
                name="purpose"
                placeholder="Describe what needs to be discussed, inspected, delivered, cleaned, repaired, or processed."
                required
              />
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              asChild
              className="h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <Link to={routeConfig.tenantDashboard}>Cancel</Link>
            </Button>
            <Button
              className="h-11 rounded-lg bg-[#f19a54] px-5 text-sm font-bold text-white hover:bg-[#eb934a]"
              type="button"
            >
              Save Draft
            </Button>
            <Button className="h-11 rounded-lg bg-[#d65b2b] px-5 text-sm font-bold text-white hover:bg-[#c64f23]">
              <CalendarDays className="h-4 w-4" />
              Request Slot
            </Button>
          </div>
        </form>

        <aside className="space-y-4">
          <section className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <Clock className="h-4 w-4 text-[#d65b2b]" />
              Available Slots
            </div>
            <div className="mt-4 space-y-3">
              {availableSlots.map((slot) => (
                <button
                  className="w-full rounded-lg border border-slate-200 bg-[#fafafa] p-3 text-left transition hover:border-[#d65b2b] hover:bg-[#fff3ed]"
                  key={`${slot.day}-${slot.time}`}
                  type="button"
                  onClick={() => setSelectedDate(slot.date)}
                >
                  <div className="text-sm font-bold text-slate-950">{slot.day}</div>
                  <div className="mt-1 text-xs text-slate-500">{slot.time}</div>
                  <div className="mt-2 text-xs font-semibold text-[#d65b2b]">{slot.office}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <ClipboardList className="h-4 w-4 text-[#d65b2b]" />
              Upcoming
            </div>
            <div className="mt-4 space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div className="rounded-lg bg-[#fff3ed] p-3" key={appointment.title}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-950">{appointment.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{appointment.detail}</div>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#d65b2b]">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-[#626060] p-4 text-white shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 text-sm font-bold">
              <UsersRound className="h-4 w-4" />
              Appointment Lifecycle
            </div>
            <p className="mt-3 text-sm leading-6 text-white/90">
              Appointment requests are reviewed by the office, approved into a slot, reminded
              through notifications, and marked completed after the visit or meeting.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = 'text',
}: {
  label: string
  name: string
  placeholder?: string
  required?: boolean
  type?: string
}) {
  return (
    <div>
      <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor={name}>
        {label}
      </Label>
      <Input
        className="mt-2 h-11 bg-white"
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </div>
  )
}

function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string
  name: string
  options: string[]
  required?: boolean
}) {
  return (
    <div>
      <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor={name}>
        {label}
      </Label>
      <select
        className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#d65b2b] focus:ring-3 focus:ring-[#d65b2b]/15"
        id={name}
        name={name}
        required={required}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
