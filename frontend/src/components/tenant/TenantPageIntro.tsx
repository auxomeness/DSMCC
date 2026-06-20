type TenantPageIntroProps = {
  eyebrow: string
  title: string
}

export function TenantPageIntro({ eyebrow, title }: TenantPageIntroProps) {
  return (
    <section className="mb-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#d65b2b]">{eyebrow}</p>
      <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950 md:text-2xl">
        {title}
      </h1>
    </section>
  )
}
