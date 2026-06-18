import { ClipboardList, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[#d9691e] px-4 shadow-sm md:px-6">
      <Link className="text-base font-bold tracking-wide text-white" to="/">
        DECA Sentrio
      </Link>

      <nav aria-label="Primary" className="hidden items-center gap-2 sm:flex">
        <Button
          asChild
          className="h-9 w-10 rounded-lg bg-[#e8874a] p-0 text-white hover:bg-[#c75c10]"
          title="Home"
        >
          <Link to="/">
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>
        </Button>
        <Button
          asChild
          className="h-9 w-10 rounded-lg bg-[#e8874a] p-0 text-white hover:bg-[#c75c10]"
          title="Portal"
        >
          <Link to="/login">
            <ClipboardList className="h-5 w-5" />
            <span className="sr-only">Portal</span>
          </Link>
        </Button>
      </nav>

      <div className="hidden items-center gap-2 sm:flex">
        <Button
          asChild
          variant="outline"
          className="h-8 rounded-md border-2 border-white bg-transparent px-4 text-xs font-bold tracking-wide text-white hover:bg-white hover:text-[#d9691e]"
        >
          <Link to="/login">LOGIN</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-8 rounded-md border-2 border-white bg-transparent px-4 text-xs font-bold tracking-wide text-white hover:bg-white hover:text-[#d9691e]"
        >
          <Link to="/register">REGISTER</Link>
        </Button>
      </div>
    </header>
  )
}
