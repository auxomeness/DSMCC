const sidebarItems = [
  'System Introduction',
  'Office Hours',
  'About DECA Portal',
  'Available Offices',
  'Available Services',
  'Contact Information',
]

export function PublicSidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-2 px-4 py-3 md:w-[220px] md:px-0 md:py-0">
      {sidebarItems.map((item, index) => (
        <button
          className={[
            'min-h-12 rounded-lg px-3 py-3 text-center text-sm shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-colors',
            index === 0
              ? 'bg-[#d9691e] font-semibold text-white'
              : 'bg-white text-slate-700 hover:bg-[#e8874a] hover:text-white',
          ].join(' ')}
          key={item}
          type="button"
        >
          {item}
        </button>
      ))}
    </aside>
  )
}
