import { motion } from 'framer-motion'
import { ArrowDownRight, MapPin, Sparkles } from 'lucide-react'
import { useStore } from '../lib/store'
import { uid } from '../lib/content'
import { AddBtn, DelBtn, ET } from './Editable'
import { SplitText, Tilt, useTyped } from './fx'

const chips = [
  { t: 'Flat vector', cls: '-left-4 top-16 sm:-left-10', d: 0 },
  { t: 'Pop-out 3D', cls: '-right-3 top-1/3 sm:-right-8', d: 1.2 },
  { t: 'Prompt → Print', cls: 'bottom-14 -left-2 sm:-left-12', d: 2.2 },
]

export default function Hero() {
  const { c, edit, update } = useStore()
  const typed = useTyped(
    c.typed.map((t) => t.text),
    !edit,
  )
  return (
    <section id="top" className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 pb-16 pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:pt-28">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 font-mono text-xs text-muted backdrop-blur"
        >
          <span className="pulse-ring h-2 w-2 rounded-full bg-accent2" />
          <ET value={c.meta.badge} onChange={(v) => update((d) => void (d.meta.badge = v))} />
        </motion.div>

        <h1 className="font-display text-[3.4rem] font-light leading-[0.92] tracking-tight sm:text-[5.5rem] lg:text-[6.8rem]">
          {edit ? (
            <>
              <ET as="div" value={c.meta.name} onChange={(v) => update((d) => void (d.meta.name = v))} />
              <ET as="div" className="italic" value={c.meta.surname} onChange={(v) => update((d) => void (d.meta.surname = v))} />
            </>
          ) : (
            <>
              <div className="overflow-hidden pb-2">
                <SplitText text={c.meta.name} />
              </div>
              <div className="overflow-hidden pb-3">
                <SplitText text={c.meta.surname} className="shimmer italic font-medium" delay={0.3} />
              </div>
            </>
          )}
        </h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-6 max-w-xl text-xl font-light leading-snug text-fg/90 sm:text-2xl">
          <ET value={c.meta.role} onChange={(v) => update((d) => void (d.meta.role = v))} />
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-5 min-h-[2rem] font-mono text-sm text-accent">
          {edit ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted">Бегущая строка:</span>
              {c.typed.map((t, i) => (
                <span key={t.id} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2 py-1">
                  <ET value={t.text} onChange={(v) => update((d) => void (d.typed[i].text = v))} />
                  <DelBtn onClick={() => update((d) => void d.typed.splice(i, 1))} />
                </span>
              ))}
              <AddBtn className="!py-1" onClick={() => update((d) => void d.typed.push({ id: uid(), text: 'Новая фраза' }))}>
                фраза
              </AddBtn>
            </div>
          ) : (
            <>
              <span className="text-muted">&gt; </span>
              {typed}
              <span className="caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-accent" />
            </>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-5 flex items-center gap-2 text-sm text-muted">
          <MapPin size={15} className="text-accent" />
          <ET value={c.meta.location} onChange={(v) => update((d) => void (d.meta.location = v))} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="mt-9 flex flex-wrap gap-3">
          <a
            href="#cases"
            onClick={(e) => edit && e.preventDefault()}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-on-accent transition hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-8px_var(--accent)]"
          >
            <ET value={c.meta.btnPrimary} onChange={(v) => update((d) => void (d.meta.btnPrimary = v))} />
            <ArrowDownRight size={18} className="transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>
          <a
            href="#contacts"
            onClick={(e) => edit && e.preventDefault()}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-6 py-3.5 text-sm font-medium backdrop-blur transition hover:-translate-y-0.5 hover:border-accent"
          >
            <ET value={c.meta.btnSecondary} onChange={(v) => update((d) => void (d.meta.btnSecondary = v))} />
          </a>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-[400px]">
        <div className="absolute -inset-8 rounded-full bg-accent/20 blur-3xl" />
        <div className="spin-slow absolute -inset-5 rounded-t-[999px] rounded-b-[2rem] opacity-80" style={{ background: 'conic-gradient(from 0deg, transparent 0 55%, var(--accent), var(--accent2), transparent)', filter: 'blur(14px)' }} />
        <Tilt max={9} className="relative">
          <div className="relative rounded-t-[999px] rounded-b-[2rem] p-[3px]" style={{ background: 'linear-gradient(160deg, var(--accent), transparent 40%, var(--accent2))' }}>
            <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[calc(2rem-3px)] bg-bg2">
              <img src={c.photo} alt={`${c.meta.name} ${c.meta.surname}`} className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-xl border border-line bg-bg/60 px-3 py-2 font-mono text-xs backdrop-blur-md">
                <Sparkles size={14} className="text-accent" />
                <span className="truncate">AI × Human touch</span>
              </div>
            </div>
          </div>
          {chips.map((ch) => (
            <div key={ch.t} className={`absolute ${ch.cls} hidden sm:block`}>
              <div className="floaty rounded-full border border-line bg-bg/80 px-3.5 py-1.5 font-mono text-xs text-accent shadow-xl backdrop-blur-md" style={{ animationDelay: `${ch.d}s` }}>
                {ch.t}
              </div>
            </div>
          ))}
        </Tilt>
        <div className="spin-rev pointer-events-none absolute -right-10 -top-10 hidden h-28 w-28 rounded-full border border-dashed border-accent/50 sm:block" />
      </motion.div>
    </section>
  )
}