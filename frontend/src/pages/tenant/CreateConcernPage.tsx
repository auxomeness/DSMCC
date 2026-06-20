import {
  Building2,
  CalendarDays,
  Camera,
  ClipboardList,
  MapPin,
  Send,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { TenantPageIntro } from '@/components/tenant/TenantPageIntro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { routeConfig } from '@/routes/routeConfig'

const categories = [
  'Plumbing',
  'Electrical',
  'Water Supply',
  'Cleaning',
  'Waste Management',
  'Facility Maintenance',
  'Administrative Concern',
  'Others',
]

const offices = [
  'Maintenance Office',
  'Plumbing Office',
  'Electrical Office',
  'Water Utility Office',
  'Cleaning Office',
  'Administration Office',
]

const workflowSteps = [
  'Create concern',
  'Select office',
  'Specify location',
  'Attach proof',
  'Choose schedule',
  'Submit for review',
]

export function CreateConcernPage() {
  return (
    <div className="pb-4">
      <TenantPageIntro
        eyebrow="Create E-Concern"
        title="Report a maintenance or administration concern"
      />

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)] md:p-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid gap-4 lg:grid-cols-2 mb-4">
            <Field label="Concern Title" name="title" placeholder="e.g. Leaking faucet" required />

            <SelectField label="Category" name="category" options={categories} required />

          </div>
            <SelectField label="Office Assignment" name="office" options={offices} required/>

          <div className="mt-5">
            <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="description">
              Description
            </Label>
            <textarea
              className="mt-2 min-h-32 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#d65b2b] focus:ring-3 focus:ring-[#d65b2b]/15"
              id="description"
              name="description"
              placeholder="Describe the issue, when it started, and what area is affected."
              required
            />
          </div>

          <section className="mt-5 rounded-lg border border-slate-200 bg-[#fafafa] p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <MapPin className="h-4 w-4 text-[#d65b2b]" />
              Location Details
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Floor" name="floor" placeholder="12" required />
              <Field label="Unit Number" name="unitNumber" placeholder="12B" required />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Field
                label="Specific Location"
                name="specificLocation"
                placeholder="Kitchen sink, hallway, elevator lobby"
                required
              />
              <Field
                label="Additional Notes"
                name="locationNotes"
                placeholder="Landmarks or access instructions"
              />
            </div>
          </section>

          <section className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-[#fafafa] p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <CalendarDays className="h-4 w-4 text-[#d65b2b]" />
                Preferred Schedule
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Preferred Date" name="preferredDate" type="date" />
                <SelectField
                  label="Preferred Time"
                  name="preferredTime"
                  options={['9:00AM', '1:30PM', 'Any available slot']}
                />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#fafafa] p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <Camera className="h-4 w-4 text-[#d65b2b]" />
                Proof Attachment
              </div>
              <div className="mt-4">
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="attachments">
                  Photos or Videos
                </Label>
                <Input
                  accept="image/*,video/*"
                  className="mt-2 h-11 bg-white"
                  id="attachments"
                  multiple
                  name="attachments"
                  type="file"
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Attach images or videos to help the office verify and assign the concern faster.
                </p>
              </div>
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
              <Send className="h-4 w-4" />
              Submit Concern
            </Button>
          </div>
        </form>

        <aside className="space-y-4">
          <section className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <ClipboardList className="h-4 w-4 text-[#d65b2b]" />
              Submission Flow
            </div>
            <ol className="mt-4 space-y-3">
              {workflowSteps.map((step, index) => (
                <li className="flex gap-3" key={step}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fff3ed] text-xs font-bold text-[#d65b2b]">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm font-medium text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-lg bg-[#d65b2b] p-4 text-white shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Building2 className="h-4 w-4" />
              Office Review
            </div>
            <p className="mt-3 text-sm leading-6 text-white/90">
              Submitted concerns go to the selected office for acceptance, staff assignment,
              status updates, and tenant verification before closure.
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
