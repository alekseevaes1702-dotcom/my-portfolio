import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useStore } from '../lib/store'
import type { SectionKey } from '../lib/content'
import { ET } from './Editable'

const keys: SectionKey[] = ['about', 'skills', 'cases', 'related', 'education', 'contacts']

export default function Nav() {
  const { c, edit, update } = useStore()
  const [open, setOpen] = useState(false)
  const list = keys.filter((k) => edit || !c.hidden[k])
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl border border-line bg-bg/70 px-4 py-2.5 backdrop-blur-xl sm:px-5" style={{ width: 'calc(100% - 1.5rem)' }}>
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-display text-lg font-semibold text-on-accent">
            {(c.meta.name[0] || '') + (c.meta.surname[0] || '')}
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-muted sm:block">portfolio</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {list.map((k) => (
            <a
              key={k}
              href={`#${k}`}
              onClick={(e) => edit && e.preventDefault()}
              className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-card hover:text-fg"
            >
              <ET value={c.nav[k]} onChange={(v) => update((d) => void (d.nav[k] = v))} />
            </a>
          ))}
        </nav>
        <button className="grid h-9 w-9 place-items-center rounded-lg border border-line md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Меню">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="mx-auto mt-2 rounded-2xl border border-line bg-bg/90 p-2 backdrop-blur-xl md:hidden" style={{ width: 'calc(100% - 1.5rem)' }}>
          {list.map((k) => (
            <a key={k} href={`#${k}`} onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 text-muted hover:bg-card hover:text-fg">
              {c.nav[k]}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
