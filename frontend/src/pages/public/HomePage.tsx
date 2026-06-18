import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eeeeef] px-6">
      <section className="max-w-xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#d75728]">
          DECA Sentrio
        </p>
        <h1 className="text-3xl font-semibold text-slate-950 md:text-4xl">
          Wala pa Homepage.
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Manage concerns, appointments, or feedbacks. 
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild className="rounded-full bg-[#d75728] px-6 hover:bg-[#c84d23]">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
