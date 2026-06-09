export function CatalogBackdrop({ tone = 'gold' }: { tone?: 'gold' | 'rose' | 'blue' }) {
  const accent =
    tone === 'rose'
      ? 'rgba(126, 34, 80, 0.16)'
      : tone === 'blue'
        ? 'rgba(37, 99, 235, 0.13)'
        : 'rgba(184, 138, 45, 0.16)'

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -top-32 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: accent }}
      />
      <div className="absolute left-[-12rem] top-64 h-[28rem] w-[28rem] rounded-full bg-champagne/50 blur-3xl" />
      <div className="absolute right-[-10rem] top-28 h-[26rem] w-[26rem] rounded-full bg-white/80 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(184,138,45,0.08),transparent_28%,rgba(255,255,255,0.72)_52%,transparent_74%),radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.92),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.32] [background-image:linear-gradient(rgba(12,10,9,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(12,10,9,0.055)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute left-[-8rem] top-[22rem] h-16 w-[44rem] -rotate-12 rounded-full border border-gold/15 bg-gradient-to-r from-transparent via-gold/12 to-transparent blur-[1px]" />
      <div className="absolute right-[-10rem] top-[40rem] h-20 w-[40rem] rotate-12 rounded-full border border-gold/10 bg-gradient-to-r from-transparent via-white/80 to-gold/10 blur-[1px]" />
    </div>
  )
}
