const roles = ['Tenant', 'Staff', 'Admin'] as const

type RoleTabsProps = {
  activeRole?: (typeof roles)[number]
}

export function RoleTabs({ activeRole = 'Tenant' }: RoleTabsProps) {
  return (
    <div className="grid rounded-full bg-[#eeeeef] p-1 text-base font-bold text-slate-500">
      <div className="grid grid-cols-3 gap-1">
        {roles.map((role) => {
          const isActive = role === activeRole

          return (
            <button
              className={
                isActive
                  ? 'h-12 rounded-full bg-[#d75728] text-white shadow-sm'
                  : 'h-12 rounded-full text-slate-500 transition hover:bg-white/70'
              }
              key={role}
              type="button"
            >
              {role}
            </button>
          )
        })}
      </div>
    </div>
  )
}
