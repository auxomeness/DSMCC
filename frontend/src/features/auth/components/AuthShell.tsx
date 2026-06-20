import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { Button } from '@/components/ui/button'
import { routeConfig } from '@/routes/routeConfig'
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
    <main className="min-h-screen bg-[#eeeeef] pb-20 sm:pb-0">
      <section className="relative bg-[#d65b2b] px-4 pb-20 pt-5 text-white sm:px-8 md:px-12 md:pb-24">
        <header className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to={routeConfig.home} className="text-xl font-bold tracking-tight md:text-2xl">
            DECA Sentrio
          </Link>
          
        </header>

        <div className="mx-auto mt-12 max-w-7xl md:mt-14">
          <p className="text-sm font-bold uppercase tracking-wide text-white/80">
            Resident Portal
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-white md:text-base">
            {subtitle}
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-12 px-4 pb-12">
        <div className={cn('mx-auto w-full max-w-[380px]', panelClassName)}>
          {children}
        </div>
      </section>

      <MobileBottomNav />
    </main>
  )
}
