import { ClipboardList, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { routeConfig } from '@/routes/routeConfig'

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-center gap-2 bg-[#D96C3D] px-4 sm:hidden"
    >
      <Button
        asChild
        className="h-10 w-10 rounded-lg bg-[#e8874a] p-0 text-white hover:bg-[#c75c10]"
        title="Home"
      >
        <Link to={routeConfig.home}>
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Link>
      </Button>
      <Button
        asChild
        className="h-10 w-10 rounded-lg bg-[#e8874a] p-0 text-white hover:bg-[#c75c10]"
        title="Feedback"
      >
        <Link to={routeConfig.feedback}>
          <ClipboardList className="h-5 w-5" />
          <span className="sr-only">Feedback</span>
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="h-9 rounded-md border-2 border-white bg-transparent px-3 text-xs font-bold text-white hover:bg-white hover:text-[#d9691e]"
      >
        <Link to={routeConfig.login}>LOGIN</Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="h-9 rounded-md border-2 border-white bg-transparent px-3 text-xs font-bold text-white hover:bg-white hover:text-[#d9691e]"
      >
        <Link to={routeConfig.register}>REGISTER</Link>
      </Button>
    </nav>
  )
}
