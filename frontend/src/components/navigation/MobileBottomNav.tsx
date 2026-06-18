import { ClipboardList, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-center gap-2 bg-[#d9691e] px-4 sm:hidden"
    >
      <Button
        asChild
        className="h-10 w-10 rounded-lg bg-[#e8874a] p-0 text-white hover:bg-[#c75c10]"
        title="Home"
      >
        <Link to="/">
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Link>
      </Button>
      <Button
        asChild
        className="h-10 w-10 rounded-lg bg-[#e8874a] p-0 text-white hover:bg-[#c75c10]"
        title="Portal"
      >
        <Link to="/login">
          <ClipboardList className="h-5 w-5" />
          <span className="sr-only">Portal</span>
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="h-9 rounded-md border-2 border-white bg-transparent px-3 text-xs font-bold text-white hover:bg-white hover:text-[#d9691e]"
      >
        <Link to="/login">LOGIN</Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="h-9 rounded-md border-2 border-white bg-transparent px-3 text-xs font-bold text-white hover:bg-white hover:text-[#d9691e]"
      >
        <Link to="/register">REGISTER</Link>
      </Button>
    </nav>
  )
}
