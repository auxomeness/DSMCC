export function TenantHeader() {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[#c94e23] bg-[#d65b2b] text-white shadow-sm">
      <div className="flex h-full w-full items-center justify-between px-3 sm:px-4 lg:px-5">
        <div>
          <p className="text-lg font-bold tracking-wide leading-tight">DECA Sentrio</p>
          <p className="hidden text-[10px] font-semibold uppercase tracking-wide text-white/75 sm:block">
            Tenant Portal
          </p>
        </div>
      </div>
    </header>
  )
}
