import { Bell, KeyRound, Mail, Phone, Save, ShieldCheck, UserRound } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import { TenantPageIntro } from '@/components/tenant/TenantPageIntro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const profile = {
  email: 'juan@email.com',
  name: 'Juan Dela Cruz',
  phone: '0917 123 4567',
  role: 'Verified Tenant',
  unit: 'Unit 12B',
}

export function TenantSettingsPage() {
  const [email, setEmail] = useState(profile.email)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [name, setName] = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone)
  const [portalNotifications, setPortalNotifications] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatusMessage('Settings saved as a frontend preview.')
  }

  return (
    <div className="pb-4">
      <TenantPageIntro eyebrow="Profile Settings" title="Account and notification settings" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <form
          className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)] sm:flex-1 md:p-5"
          onSubmit={handleSubmit}
        >
          <section className="grid gap-3 rounded-lg border border-slate-200 bg-[#fafafa] p-4 sm:grid-cols-3">
            <SettingsMeta icon={UserRound} label="Account" value={profile.role} />
            <SettingsMeta icon={ShieldCheck} label="Verified Unit" value={profile.unit} />
            <SettingsMeta icon={Mail} label="Login Email" value={profile.email} />
          </section>

          <section className="mt-5">
            <h2 className="text-sm font-bold text-slate-950">Profile Information</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="tenant-name">
                  Full Name
                </Label>
                <Input
                  className="mt-2 h-11 bg-white"
                  id="tenant-name"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                />
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="tenant-email">
                  Email Address
                </Label>
                <Input
                  className="mt-2 h-11 bg-white"
                  id="tenant-email"
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  value={email}
                />
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="tenant-phone">
                  Contact Number
                </Label>
                <Input
                  className="mt-2 h-11 bg-white"
                  id="tenant-phone"
                  onChange={(event) => setPhone(event.target.value)}
                  type="tel"
                  value={phone}
                />
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="tenant-unit">
                  Unit
                </Label>
                <Input className="mt-2 h-11 bg-slate-50 text-slate-500" disabled id="tenant-unit" value={profile.unit} />
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-lg border border-slate-200 bg-[#fafafa] p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <Bell className="h-4 w-4 text-[#d65b2b]" />
              Notification Preferences
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <SettingToggle
                checked={portalNotifications}
                description="Concern updates, assignments, appointment approvals, and resolution notices."
                label="In-app notifications"
                onChange={setPortalNotifications}
              />
              <SettingToggle
                checked={emailNotifications}
                description="Email copies for important status changes and appointment confirmations."
                label="Email notifications"
                onChange={setEmailNotifications}
              />
            </div>
          </section>

          <section className="mt-5 rounded-lg border border-slate-200 bg-[#fafafa] p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <KeyRound className="h-4 w-4 text-[#d65b2b]" />
              Password Preview
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="tenant-password">
                  New Password
                </Label>
                <Input className="mt-2 h-11 bg-white" id="tenant-password" placeholder="Enter new password" type="password" />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="tenant-confirm-password">
                  Confirm Password
                </Label>
                <Input className="mt-2 h-11 bg-white" id="tenant-confirm-password" placeholder="Confirm new password" type="password" />
              </div>
            </div>
          </section>

          {statusMessage ? (
            <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {statusMessage}
            </p>
          ) : null}

          <div className="mt-6 flex justify-end">
            <Button className="h-11 rounded-lg bg-[#d65b2b] px-5 text-sm font-bold text-white hover:bg-[#c64f23]">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </form>

        <aside className="space-y-4" style={{ flex: '0 0 min(20rem, 100%)' }}>
          <section className="rounded-lg bg-[#d65b2b] p-4 text-white shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="h-4 w-4" />
              Tenant Verification
            </div>
            <p className="mt-3 text-sm leading-6 text-white/90">
              Profile and Unit verification can only be changed after admin request has been verified.
            </p>
          </section>

          <section className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <Phone className="h-4 w-4 text-[#d65b2b]" />
              Contact Snapshot
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <SummaryRow label="Name" value={name} />
              <SummaryRow label="Email" value={email} />
              <SummaryRow label="Phone" value={phone} />
              <SummaryRow label="Unit" value={profile.unit} />
            </dl>
          </section>
        </aside>
      </div>
    </div>
  )
}

function SettingsMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3ed] text-[#d65b2b]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-slate-950">{value}</p>
      </div>
    </div>
  )
}

function SettingToggle({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean
  description: string
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex min-h-24 cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <input
        checked={checked}
        className="mt-1 h-4 w-4 accent-[#d65b2b]"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span>
        <span className="block text-sm font-bold text-slate-950">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-semibold text-slate-700">{value}</dd>
    </div>
  )
}
