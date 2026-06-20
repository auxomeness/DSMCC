import { ClipboardList, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { routeConfig } from '@/routes/routeConfig'

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[#d65b2b] px-4 shadow-sm md:px-6">
      <Link className="text-base font-bold tracking-wide text-white" to={routeConfig.home}>
        DECA Sentrio
      </Link>

      <nav aria-label="Primary" className="hidden items-center gap-2 sm:flex">
        <Button
          asChild
          className="h-9 w-10 rounded-lg bg-[#f19a54] p-0 text-white hover:bg-[#c64f23]"
          title="Home"
        >
          <Link to={routeConfig.home}>
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>
        </Button>
        <Button
          asChild
          className="h-9 w-10 rounded-lg bg-[#f19a54] p-0 text-white hover:bg-[#c64f23]"
          title="Feedback"
        >
          <Link to={routeConfig.feedback}>
            <ClipboardList className="h-5 w-5" />
            <span className="sr-only">Feedback</span>
          </Link>
        </Button>
      </nav>

      <div className="hidden items-center gap-2 sm:flex">
        <Button
          asChild
          className="h-9 rounded-full bg-[#f19a54] px-5 text-xs font-bold tracking-wide text-white hover:bg-[#eb934a]"
        >
          <Link to={routeConfig.login}>LOGIN</Link>
        </Button>
        <Button
          asChild
          className="h-9 rounded-full bg-white px-5 text-xs font-bold tracking-wide text-[#d65b2b] hover:bg-white/90"
        >
          <Link to={routeConfig.register}>REGISTER</Link>
        </Button>
      </div>
    </header>
  )
}
