import { Star } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { routeConfig } from '@/routes/routeConfig'
import { cn } from '@/utils/cn'

type FeedbackType = 'FEEDBACK' | 'Concern'

const feedbackTypeOptions: Array<{ label: string; value: FeedbackType }> = [
  { label: 'Feedback', value: 'FEEDBACK' },
  { label: 'Concern', value: 'Concern' },
]

export function FeedbackPage() {
  const [email, setEmail] = useState('')
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('FEEDBACK')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [status, setStatus] = useState<'error' | 'idle' | 'success'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const ratingLabel = useMemo(() => {
    return rating > 0 ? `${rating} out of 5` : 'No rating selected'
  }, [rating])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (trimmedMessage.length < 5) {
      setStatus('error')
      setStatusMessage('Please enter at least 5 characters in your message.')
      return
    }

    setEmail('')
    setFeedbackType('FEEDBACK')
    setMessage('')
    setName('')
    setRating(0)
    setStatus('success')
    setStatusMessage('Thank you. Your feedback has been saved as a frontend preview.')
  }

  return (
    <main className="min-h-screen bg-[#eeeeef] pb-20 sm:pb-0">
      <section className="bg-[#d65b2b] px-4 pb-20 pt-5 text-white sm:px-8 md:px-12 md:pb-24">
        <header className="mx-auto flex max-w-7xl items-center justify-between">
          <Link className="text-xl font-bold tracking-tight md:text-2xl" to={routeConfig.home}>
            DECA Sentrio
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <Button
              asChild
              className="h-9 min-w-[80px] rounded-full bg-[#f2a15b] px-5 text-sm font-bold text-white hover:bg-[#eb934a]"
            >
              <Link to={routeConfig.login}>Login</Link>
            </Button>
            <Button
              asChild
              className="h-9 min-w-[96px] rounded-full bg-white px-5 text-sm font-bold text-[#d65b2b] hover:bg-white/90"
            >
              <Link to={routeConfig.register}>Register</Link>
            </Button>
          </div>
        </header>
        
        <div className="mx-auto mt-12 max-w-7xl md:mt-14">
          <p className="text-sm font-bold uppercase tracking-wide text-white/80">
            Feedback Form
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Feedback & Concerns
          </h1>
          <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-white md:text-base">
            Tell us how we&apos;re doing or suggest something we could do better.
          </p>
        </div>
      </section>

      <section className="-mt-12 px-4 pb-12 sm:px-6 md:px-8">
        <form
          className="mx-auto w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-[0_1px_8px_rgba(15,23,42,0.14)] md:p-8"
          onSubmit={handleSubmit}
        >
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-950">Overall Service Rating</Label>
              <div className="flex items-center gap-1" role="radiogroup" aria-label={ratingLabel}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    aria-checked={rating === value}
                    aria-label={`${value} star${value === 1 ? '' : 's'}`}
                    className="rounded-md p-1 text-slate-300 transition-colors hover:text-[#d65b2b] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#f2a15b]/50"
                    key={value}
                    onClick={() => setRating(value)}
                    role="radio"
                    type="button"
                  >
                    <Star
                      className={cn(
                        'h-6 w-6',
                        value <= rating && 'fill-[#d65b2b] text-[#d65b2b]',
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-bold text-slate-950">Feedback Type</legend>
              <div className="grid grid-cols-2 gap-3">
                {feedbackTypeOptions.map((option) => (
                  <button
                    className={cn(
                      'min-h-11 rounded-lg border px-4 text-sm font-medium transition-colors',
                      feedbackType === option.value
                        ? 'border-[#d65b2b] bg-[#fff3ed] text-[#d65b2b]'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#f2a15b] hover:text-[#d65b2b]',
                    )}
                    key={option.value}
                    onClick={() => setFeedbackType(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-950" htmlFor="feedback-name">
                  Name <span className="font-medium text-slate-500">(optional)</span>
                </Label>
                <Input
                  className="h-11 rounded-lg border-slate-300 px-4 text-sm shadow-none"
                  id="feedback-name"
                  maxLength={100}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Juan Dela Cruz"
                  value={name}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-950" htmlFor="feedback-email">
                  Email <span className="font-medium text-slate-500">(optional)</span>
                </Label>
                <Input
                  className="h-11 rounded-lg border-slate-300 px-4 text-sm shadow-none"
                  id="feedback-email"
                  maxLength={180}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="juan@email.com"
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-950" htmlFor="feedback-message">
                Message <span className="text-[#d65b2b]">*</span>
              </Label>
              <textarea
                className="min-h-32 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus-visible:border-[#d65b2b] focus-visible:ring-3 focus-visible:ring-[#f2a15b]/40"
                id="feedback-message"
                maxLength={2000}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Share your thoughts..."
                required
                value={message}
              />
            </div>

            {statusMessage ? (
              <p
                className={cn(
                  'rounded-lg border px-4 py-3 text-sm font-medium',
                  status === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-red-200 bg-red-50 text-red-700',
                )}
              >
                {statusMessage}
              </p>
            ) : null}

            <div className="flex flex-col items-center gap-4">
              <Button
                className="h-12 w-full rounded-full bg-[#d65b2b] px-8 text-base font-bold text-white shadow-[0_1px_5px_rgba(15,23,42,0.16)] hover:bg-[#c64f23] sm:w-auto sm:min-w-[192px]"
                type="submit"
              >
                Submit Feedback
              </Button>
              <p className="text-center text-xs leading-5 text-slate-500">
                Submissions are reviewed by DECA Sentrio admin staff.
              </p>
            </div>
          </div>
        </form>
      </section>

      <MobileBottomNav />
    </main>
  )
}
