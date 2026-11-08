import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AtSign,
  Check,
  Clapperboard,
  Eye,
  EyeOff,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Printer,
  ShieldCheck,
  Store,
  Wand2,
  Quote,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { uid, type SectionKey } from '../lib/content'
import { AddBtn, cx, DelBtn, ET } from './Editable'
import { CountUp, Reveal } from './fx'

const order: SectionKey[] = ['about', 'skills', 'cases', 'related', 'current', 'education', 'contacts']

function Section({ k, children, className, num = true }: { k: SectionKey; children: ReactNode; className?: string; num?: boolean }) {
  const { c, edit, update } = useStore()
  const hidden = !!c.hidden[k]
  if (hidden && !edit) return null
  const idx = String(order.indexOf(k) + 1).padStart(2, '0')
  return (
    <section id={k} className={cx('relative mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:py-28', hidden && 'opacity-45', className)}>
      <Reveal className="mb-12 flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-4">
          {num && <span className="font-mono text-sm text-accent">{idx}</span>}
          <h2 className="font-display text-4xl font-light leading-tight sm:text-6xl">
            <ET value={c.titles[k]} onChange={(v) => update((d) => void (d.titles[k] = v))} />
          </h2>
        </div>
        {edit && (
          <button
            onClick={() => update((d) => void (d.hidden[k] = !d.hidden[k]))}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-xs text-muted hover:text-fg"
          >
            {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
            {hidden ? 'Скрыто' : 'Показано'}
          </button>
        )}
      </Reveal>
      {children}
    </section>
  )
}

export function Marquee() {
  const { c, edit, update } = useStore()
  if (edit) {
    return (
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-5 py-6">
        <span className="font-mono text-xs text-muted">Бегущая лента:</span>
        {c.tools.map((t, i) => (
          <span key={t.id} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-sm">
            <ET value={t.text} onChange={(v) => update((d) => void (d.tools[i].text = v))} />
            <DelBtn onClick={() => update((d) => void d.tools.splice(i, 1))} />
          </span>
        ))}
        <AddBtn className="!py-1" onClick={() => update((d) => void d.tools.push({ id: uid(), text: 'Новый навык' }))}>
          навык
        </AddBtn>
      </div>
    )
  }
  const row = c.tools.length ? [...c.tools, ...c.tools, ...c.tools, ...c.tools] : []
  return (
    <div className="relative overflow-hidden border-y border-line bg-bg/40 py-5 backdrop-blur-sm" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}>
      <div className="marquee">
        {[0, 1].map((n) => (
          <div key={n} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={i} className="flex items-center font-display text-3xl font-light italic text-fg/80 sm:text-4xl">
                <span className="px-6">{t.text}</span>
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function About() {
  const { c, edit, update } = useStore()
  return (
    <Section k="about">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {c.about.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.08}>
              <div className="group flex items-start gap-3">
                {i === 0 ? <Quote size={22} className="mt-1.5 shrink-0 text-accent" /> : <span className="mt-3 h-px w-6 shrink-0 bg-accent" />}
                <ET
                  as="p"
                  className={i === 0 ? 'font-display text-2xl font-light leading-snug sm:text-[2rem]' : 'text-lg font-light leading-relaxed text-fg/85'}
                  value={a.text}
                  onChange={(v) => update((d) => void (d.about[i].text = v))}
                />
                <DelBtn onClick={() => update((d) => void d.about.splice(i, 1))} />
              </div>
            </Reveal>
          ))}
          <AddBtn onClick={() => update((d) => void d.about.push({ id: uid(), text: 'Новый абзац о себе' }))}>Добавить абзац</AddBtn>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {c.stats.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <div className="spot relative h-full rounded-2xl border border-line bg-card p-5 backdrop-blur transition hover:-translate-y-1 hover:border-accent/60">
                <div className="absolute right-2 top-2">
                  <DelBtn onClick={() => update((d) => void d.stats.splice(i, 1))} />
                </div>
                <div className="relative font-display text-5xl font-light text-accent sm:text-6xl">
                  {edit ? <ET value={s.value} onChange={(v) => update((d) => void (d.stats[i].value = v))} /> : <CountUp value={s.value} />}
                </div>
                <ET as="div" className="relative mt-2 text-sm leading-snug text-muted" value={s.label} onChange={(v) => update((d) => void (d.stats[i].label = v))} />
              </div>
            </Reveal>
          ))}
          <AddBtn onClick={() => update((d) => void d.stats.push({ id: uid(), value: '1', label: 'новая метрика' }))}>Метрика</AddBtn>
        </div>
      </div>

      <Reveal className="mt-20">
        <div className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <ET value={c.stepsTitle} onChange={(v) => update((d) => void (d.stepsTitle = v))} />
        </div>
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-[22px] hidden h-px origin-left bg-gradient-to-r from-accent via-accent2 to-transparent lg:block"
          />
          {c.steps.map((s, i) => (
            <div key={s.id} className="relative">
              <div className="relative z-10 mb-4 grid h-11 w-11 place-items-center rounded-full border border-accent bg-bg font-mono text-sm text-accent">{i + 1}</div>
              <div className="flex items-start gap-1">
                <ET as="h4" className="font-display text-2xl" value={s.title} onChange={(v) => update((d) => void (d.steps[i].title = v))} />
                <DelBtn onClick={() => update((d) => void d.steps.splice(i, 1))} />
              </div>
              <ET as="p" className="mt-1 block text-sm leading-relaxed text-muted" value={s.text} onChange={(v) => update((d) => void (d.steps[i].text = v))} />
            </div>
          ))}
        </div>
        <AddBtn className="mt-6" onClick={() => update((d) => void d.steps.push({ id: uid(), title: 'Новый шаг', text: 'Опишите этап работы' }))}>
          Шаг
        </AddBtn>
      </Reveal>
    </Section>
  )
}

export function Skills() {
  const { c, update } = useStore()
  return (
    <Section k="skills">
      <div className="grid gap-4 sm:grid-cols-2">
        {c.skills.map((s, i) => (
          <Reveal key={s.id} delay={(i % 2) * 0.08}>
            <div className="spot group relative flex h-full gap-5 rounded-2xl border border-line bg-card p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-accent/60">
              <span className="relative font-display text-5xl font-light leading-none text-accent/70 transition group-hover:text-accent">{String(i + 1).padStart(2, '0')}</span>
              <ET as="p" className="relative flex-1 pt-1 text-lg leading-snug" value={s.text} onChange={(v) => update((d) => void (d.skills[i].text = v))} />
              <DelBtn className="absolute right-3 top-3" onClick={() => update((d) => void d.skills.splice(i, 1))} />
            </div>
          </Reveal>
        ))}
      </div>
      <AddBtn className="mt-4" onClick={() => update((d) => void d.skills.push({ id: uid(), text: 'Новый навык' }))}>Добавить навык</AddBtn>
    </Section>
  )
}

export function Cases() {
  const { c, update } = useStore()
  const [sel, setSel] = useState(0)
  const i = Math.min(sel, c.cases.length - 1)
  const cs = c.cases[i]
  return (
    <Section k="cases">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {c.cases.map((x, n) => (
            <button
              key={x.id}
              onClick={() => setSel(n)}
              className={cx(
                'group relative flex min-w-[240px] items-start gap-4 rounded-2xl border p-4 text-left transition lg:min-w-0',
                n === i ? 'border-accent bg-accent text-on-accent' : 'border-line bg-card hover:border-accent/60',
              )}
            >
              <span className="font-display text-3xl leading-none">{n + 1}</span>
              <span className="text-sm leading-snug">
                <span className={cx('mb-1 block font-mono text-[10px] uppercase tracking-widest', n === i ? 'opacity-70' : 'text-muted')}>Кейс {n + 1}</span>
                {x.title}
              </span>
            </button>
          ))}
          <AddBtn
            className="min-w-[200px] lg:min-w-0"
            onClick={() => {
              update((d) => void d.cases.push({ id: uid(), title: 'Новый кейс', subtitle: 'Краткое описание', items: [{ id: uid(), text: 'Что было сделано' }], note: '' }))
              setSel(c.cases.length)
            }}
          >
            Добавить кейс
          </AddBtn>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-line bg-card p-6 backdrop-blur sm:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
          <AnimatePresence mode="wait">
            {cs && (
              <motion.div key={cs.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Кейс {i + 1}</div>
                  <DelBtn
                    label="Удалить кейс"
                    onClick={() => {
                      update((d) => void d.cases.splice(i, 1))
                      setSel(0)
                    }}
                  />
                </div>
                <ET as="h3" className="mt-3 block font-display text-3xl font-light leading-tight sm:text-5xl" value={cs.title} onChange={(v) => update((d) => void (d.cases[i].title = v))} />
                <ET as="div" className="mt-3 inline-block rounded-full border border-line px-3 py-1 text-sm text-muted" value={cs.subtitle} onChange={(v) => update((d) => void (d.cases[i].subtitle = v))} />
                <ul className="mt-8 space-y-4">
                  {cs.items.map((it, n) => (
                    <motion.li key={it.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * n + 0.1 }} className="flex items-start gap-3">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/20 text-accent">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <ET as="span" className="flex-1 text-base leading-relaxed sm:text-lg" value={it.text} onChange={(v) => update((d) => void (d.cases[i].items[n].text = v))} />
                      <DelBtn onClick={() => update((d) => void d.cases[i].items.splice(n, 1))} />
                    </motion.li>
                  ))}
                </ul>
                <AddBtn className="mt-4" onClick={() => update((d) => void d.cases[i].items.push({ id: uid(), text: 'Новый пункт' }))}>
                  Пункт
                </AddBtn>
                <NoteBlock i={i} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}

function NoteBlock({ i }: { i: number }) {
  const { c, edit, update } = useStore()
  const note = c.cases[i].note
  if (!note && !edit) return null
  return (
    <div className="mt-8 rounded-2xl border-l-2 border-accent2 bg-accent2/10 p-4 text-sm italic leading-relaxed text-fg/90 sm:text-base">
      <ET value={note} placeholder="Особенность кейса (необязательно)" onChange={(v) => update((d) => void (d.cases[i].note = v))} />
    </div>
  )
}

const icons: LucideIcon[] = [Layers, Printer, Clapperboard, Store, Wand2, ShieldCheck]

export function Related() {
  const { c, update } = useStore()
  return (
    <Section k="related">
      <Reveal>
        <ET as="p" className="-mt-6 mb-10 block max-w-2xl text-lg font-light text-muted" value={c.relatedIntro} onChange={(v) => update((d) => void (d.relatedIntro = v))} />
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.related.map((r, i) => {
          const Icon = icons[i % icons.length]
          return (
            <Reveal key={r.id} delay={(i % 3) * 0.08}>
              <div className="spot group relative h-full rounded-2xl border border-line bg-card p-6 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-accent/60">
                <DelBtn className="absolute right-3 top-3" onClick={() => update((d) => void d.related.splice(i, 1))} />
                <div className="relative mb-5 grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent transition group-hover:rotate-6 group-hover:bg-accent group-hover:text-on-accent">
                  <Icon size={22} />
                </div>
                <ET as="h3" className="relative block font-display text-2xl leading-tight" value={r.title} onChange={(v) => update((d) => void (d.related[i].title = v))} />
                <ET as="p" className="relative mt-2 block text-sm leading-relaxed text-muted" value={r.text} onChange={(v) => update((d) => void (d.related[i].text = v))} />
              </div>
            </Reveal>
          )
        })}
      </div>
      <AddBtn className="mt-4" onClick={() => update((d) => void d.related.push({ id: uid(), title: 'Новое направление', text: 'Опишите смежный опыт' }))}>
        Добавить смежный опыт
      </AddBtn>
    </Section>
  )
}

export function CurrentEducation() {
  const { c, edit, update } = useStore()
  const showCur = edit || !c.hidden.current
  const showEdu = edit || !c.hidden.education
  const toggle = (k: SectionKey) =>
    edit && (
      <button onClick={() => update((d) => void (d.hidden[k] = !d.hidden[k]))} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted hover:text-fg">
        {c.hidden[k] ? <EyeOff size={13} /> : <Eye size={13} />}
        {c.hidden[k] ? 'Скрыто' : 'Показано'}
      </button>
    )
  if (!showCur && !showEdu) return null
  return (
    <section id="education" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:py-24">
      <div id="current" className="grid gap-5 lg:grid-cols-2">
        {showCur && (
          <Reveal className={cx(c.hidden.current && 'opacity-45')}>
            <div className="spot relative h-full rounded-3xl border border-line bg-card p-8 backdrop-blur">
              <div className="relative mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="text-accent" size={22} />
                  <h2 className="font-display text-3xl">
                    <ET value={c.titles.current} onChange={(v) => update((d) => void (d.titles.current = v))} />
                  </h2>
                </div>
                {toggle('current')}
              </div>
              <ET as="p" className="relative block text-lg font-light leading-relaxed text-fg/90" value={c.current} onChange={(v) => update((d) => void (d.current = v))} />
            </div>
          </Reveal>
        )}
        {showEdu && (
          <Reveal delay={0.1} className={cx(c.hidden.education && 'opacity-45')}>
            <div className="spot relative h-full rounded-3xl border border-line bg-card p-8 backdrop-blur">
              <div className="relative mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GraduationCap className="text-accent" size={24} />
                  <h2 className="font-display text-3xl">
                    <ET value={c.titles.education} onChange={(v) => update((d) => void (d.titles.education = v))} />
                  </h2>
                </div>
                {toggle('education')}
              </div>
              <ul className="relative space-y-4">
                {c.education.map((e, i) => (
                  <li key={e.id} className="flex items-start gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <ET as="span" className="flex-1 text-lg font-light leading-snug" value={e.text} onChange={(v) => update((d) => void (d.education[i].text = v))} />
                    <DelBtn onClick={() => update((d) => void d.education.splice(i, 1))} />
                  </li>
                ))}
              </ul>
              <AddBtn className="relative mt-5" onClick={() => update((d) => void d.education.push({ id: uid(), text: 'Новая запись' }))}>Добавить</AddBtn>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

function hrefFor(v: string): string | undefined {
  const s = v.trim()
  if (/^https?:\/\//.test(s)) return s
  if (/^@[\w.]+$/.test(s)) return `https://t.me/${s.slice(1)}`
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return `mailto:${s}`
  if (/^\+?[\d\s()-]{7,}$/.test(s)) return `tel:${s.replace(/[^\d+]/g, '')}`
  return undefined
}

function contactIcon(label: string): LucideIcon {
  const l = label.toLowerCase()
  if (l.includes('mail') || l.includes('почт')) return Mail
  if (l.includes('tele') || l.includes('телег')) return AtSign
  return MapPin
}

export function Contacts() {
  const { c, edit, update } = useStore()
  return (
    <Section k="contacts" num={false}>
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-line p-8 sm:p-14" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, var(--bg2)), var(--bg2) 60%)' }}>
          <div aria-hidden className="spin-slow absolute -right-24 -top-24 h-72 w-72 rounded-full border border-dashed border-accent/50" />
          <div aria-hidden className="spin-rev absolute -right-10 -top-10 h-44 w-44 rounded-full border border-accent/30" />
          <ET as="h3" className="relative block max-w-2xl font-display text-4xl font-light leading-tight sm:text-6xl" value={c.cta.title} onChange={(v) => update((d) => void (d.cta.title = v))} />
          <ET as="p" className="relative mt-4 block max-w-xl text-lg font-light text-fg/80" value={c.cta.text} onChange={(v) => update((d) => void (d.cta.text = v))} />
          <div className="relative mt-10 grid gap-3 sm:grid-cols-3">
            {c.contacts.map((ct, i) => {
              const Icon = contactIcon(ct.label)
              const href = hrefFor(ct.value)
              const Wrapper = href && !edit ? 'a' : 'div'
              return (
                <Wrapper
                  key={ct.id}
                  {...(Wrapper === 'a' ? { href, target: '_blank', rel: 'noreferrer' } : {})}
                  className="group relative block rounded-2xl border border-line bg-bg/60 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-accent"
                >
                  <DelBtn className="absolute right-3 top-3" onClick={() => update((d) => void d.contacts.splice(i, 1))} />
                  <Icon size={20} className="mb-4 text-accent transition group-hover:scale-110" />
                  <ET as="div" className="font-mono text-[11px] uppercase tracking-widest text-muted" value={ct.label} onChange={(v) => update((d) => void (d.contacts[i].label = v))} />
                  <ET as="div" className="mt-1 break-all text-lg" value={ct.value} onChange={(v) => update((d) => void (d.contacts[i].value = v))} />
                </Wrapper>
              )
            })}
          </div>
          <AddBtn className="relative mt-4" onClick={() => update((d) => void d.contacts.push({ id: uid(), label: 'Контакт', value: 'значение' }))}>
            Добавить контакт
          </AddBtn>
        </div>
      </Reveal>
    </Section>
  )
}

export function Footer() {
  const { c, update } = useStore()
  return (
    <footer className="relative mx-auto max-w-6xl border-t border-line px-5 py-8 pb-28 text-center font-mono text-xs text-muted">
      <ET value={c.footer} onChange={(v) => update((d) => void (d.footer = v))} />
    </footer>
  )
}
