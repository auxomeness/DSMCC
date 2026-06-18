import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type AuthShellProps = {
  actionHref: string
  actionLabel: string
  children: ReactNode
  panelClassName?: string
  subtitle: string
  title: string
}

export function AuthShell({
  actionHref,
  actionLabel,
  children,
  panelClassName,
  subtitle,
  title,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#eeeeef]">
      <section className="relative bg-[#d75728] px-6 pb-24 pt-6 text-white md:px-12">
        <header className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="text-3xl font-bold tracking-tight">
            DECA Sentrio
          </Link>
          <Button
            asChild
            className="h-11 min-w-[132px] rounded-full bg-white px-7 text-base font-semibold text-[#d75728] hover:bg-white/90"
          >
            <Link to={actionHref}>{actionLabel}</Link>
          </Button>
        </header>

        <div className="mx-auto mt-18 max-w-2xl text-center">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-3 text-base font-medium text-white">{subtitle}</p>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-4 pb-12">
        <div className={cn('mx-auto w-full max-w-[380px]', panelClassName)}>
          {children}
        </div>
      </section>
    </main>
  )
}
