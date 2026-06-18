import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eeeeef] px-6">
      <section className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-[#d75728]">Unauthorized</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your account does not have access to this area.
        </p>
        <Button
          asChild
          className="mt-8 h-11 min-w-[148px] rounded-full bg-[#d75728] px-8 font-semibold hover:bg-[#c84d23]"
        >
          <Link to="/login">Back to login</Link>
        </Button>
      </section>
    </main>
  )
}
