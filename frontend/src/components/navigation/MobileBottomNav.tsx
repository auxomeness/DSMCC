import { CalendarDays, ClipboardList, Home, MessageSquare, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { routeConfig } from '@/routes/routeConfig'

type MobileBottomNavProps = {
  variant?: 'public' | 'tenant'
}

const tenantItems = [
  { icon: Home, label: 'Dashboard', to: routeConfig.tenantDashboard },
  { icon: ClipboardList, label: 'Requests', to: routeConfig.tenantRequests },
  { icon: CalendarDays, label: 'Appointments', to: routeConfig.tenantScheduleAppointment },
  { icon: MessageSquare, label: 'Feedback', to: routeConfig.tenantFeedback },
  { icon: Settings, label: 'Settings', to: routeConfig.tenantSettings },
]

export function MobileBottomNav({ variant = 'public' }: MobileBottomNavProps) {
  if (variant === 'tenant') {
    return (
      <nav
        aria-label="Mobile tenant navigation"
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-center gap-2 bg-[#d65b2b] px-3 sm:hidden"
      >
        {tenantItems.map((item) => (
          <Button
            asChild
            className="h-10 w-10 rounded-lg bg-[#f19a54] p-0 text-white hover:bg-[#c64f23]"
            key={item.label}
            title={item.label}
          >
            <Link to={item.to}>
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
    )
  }

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-center gap-2 bg-[#d65b2b] px-4 sm:hidden"
    >
      <Button
        asChild
        className="h-10 w-10 rounded-lg bg-[#f19a54] p-0 text-white hover:bg-[#c64f23]"
        title="Home"
      >
        <Link to={routeConfig.home}>
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Link>
      </Button>
      <Button
        asChild
        className="h-10 w-10 rounded-lg bg-[#f19a54] p-0 text-white hover:bg-[#c64f23]"
        title="Feedback"
      >
        <Link to={routeConfig.feedback}>
          <ClipboardList className="h-5 w-5" />
          <span className="sr-only">Feedback</span>
        </Link>
      </Button>
      <Button
        asChild
        className="h-9 rounded-full bg-[#f19a54] px-3 text-xs font-bold text-white hover:bg-[#eb934a]"
      >
        <Link to={routeConfig.login}>LOGIN</Link>
      </Button>
      <Button
        asChild
        className="h-9 rounded-full bg-white px-3 text-xs font-bold text-[#d65b2b] hover:bg-white/90"
      >
        <Link to={routeConfig.register}>REGISTER</Link>
      </Button>
    </nav>
  )
}
