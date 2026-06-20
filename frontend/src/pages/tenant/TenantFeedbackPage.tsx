import { Building2, ClipboardList, MessageSquare, Send, Star, UserRound } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'

import { TenantPageIntro } from '@/components/tenant/TenantPageIntro'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'

const tenantProfile = {
  email: 'juan@email.com',
  name: 'Juan Dela Cruz',
  unit: 'Unit 12B',
}

const recentSubmissions = [
  {
    date: 'Jun 18, 2026',
    label: 'Concern Experience',
    title: 'Maintenance response was okay',
  },
  {
    date: 'Jun 12, 2026',
    label: 'Suggestion',
    title: 'Xian hampri okay lang',
  },
]

export function TenantFeedbackPage() {
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [relatedRequest, setRelatedRequest] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const ratingLabel = useMemo(() => {
    return rating > 0 ? `${rating} out of 5` : 'No rating selected'
  }, [rating])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (message.trim().length < 5) {
      setStatusMessage('Please enter at least 5 characters in your message.')
      return
    }

    setMessage('')
    setRating(0)
    setRelatedRequest('')
    setStatusMessage('Tenant feedback.')
  }

  return (
    <div className="pb-4">
      <TenantPageIntro eyebrow="Tenant Feedback" title="Create a feedback" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <form
          className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)] md:p-5 sm:flex-1"
          onSubmit={handleSubmit}
        >
          <section className="grid gap-3 rounded-lg border border-slate-200 bg-[#fafafa] p-4 sm:grid-cols-3">
            <TenantMeta icon={UserRound} label="Tenant" value={tenantProfile.name} />
            <TenantMeta icon={Building2} label="Unit" value={tenantProfile.unit} />
            <TenantMeta icon={MessageSquare} label="Source" value="Verified Tenant" />
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <Label
                className="text-xs font-bold uppercase tracking-wide text-slate-500"
                htmlFor="tenant-related-request"
              >
                Related Request
              </Label>
              <select
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#d65b2b] focus:ring-3 focus:ring-[#d65b2b]/15"
                id="tenant-related-request"
                onChange={(event) => setRelatedRequest(event.target.value)}
                value={relatedRequest}
              >
                <option value="">General feedback</option>
                <option value="EC-102">EC-102 - Leaking Faucet</option>
                <option value="AP-044">AP-044 - Document Follow-up</option>
                <option value="EC-088">EC-088 - AC Maintenance</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Service Rating
              </Label>
              <div className="mt-2 flex h-11 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2" role="radiogroup" aria-label={ratingLabel}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    aria-checked={rating === value}
                    aria-label={`${value} star${value === 1 ? '' : 's'}`}
                    className="rounded-md p-1 text-slate-300 transition-colors hover:text-[#d65b2b] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#f19a54]/50"
                    key={value}
                    onClick={() => setRating(value)}
                    role="radio"
                    type="button"
                  >
                    <Star
                      className={cn(
                        'h-5 w-5',
                        value <= rating && 'fill-[#d65b2b] text-[#d65b2b]',
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-5">
            <Label
              className="text-xs font-bold uppercase tracking-wide text-slate-500"
              htmlFor="tenant-feedback-message"
            >
              Message
            </Label>
            <textarea
              className="mt-2 min-h-36 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#d65b2b] focus:ring-3 focus:ring-[#d65b2b]/15"
              id="tenant-feedback-message"
              maxLength={2000}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Share feedback about service handling, appointment experience, resolution quality, or portal improvements."
              required
              value={message}
            />
          </section>

          {statusMessage ? (
            <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {statusMessage}
            </p>
          ) : null}

          <div className="mt-6 flex justify-end">
            <Button className="h-11 rounded-lg bg-[#d65b2b] px-5 text-sm font-bold text-white hover:bg-[#c64f23]">
              <Send className="h-4 w-4" />
              Submit Tenant Feedback
            </Button>
          </div>
        </form>

        <aside className="space-y-4" style={{ flex: '0 0 min(20rem, 100%)' }}>
          <section className="rounded-lg bg-[#d65b2b] p-4 text-white shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 text-sm font-bold">
              <UserRound className="h-4 w-4" />
              Verified Tenant Context
            </div>
            <p className="mt-3 text-sm leading-6 text-white/90">
              This form is designed for authenticated tenant submissions, separate from public
              feedback. Future backend records can store the tenant ID, unit, email, and optional
              related request.
            </p>
          </section>

          <section className="rounded-lg bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <ClipboardList className="h-4 w-4 text-[#d65b2b]" />
              Recent Tenant Feedback
            </div>
            <div className="mt-4 space-y-3">
              {recentSubmissions.map((submission) => (
                <article className="rounded-lg bg-[#fff3ed] p-3" key={submission.title}>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#d65b2b]">
                    {submission.label}
                  </p>
                  <h2 className="mt-2 text-sm font-bold text-slate-950">{submission.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">{submission.date}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

function TenantMeta({
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
