import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { defaultContent, type Content } from './content'

const KEY = 'portfolio-alekseeva-v1'

interface Ctx {
  c: Content
  edit: boolean
  setEdit: (v: boolean) => void
  update: (fn: (d: Content) => void) => void
  replace: (c: Content) => void
  reset: () => void
  saved: boolean
}

const StoreCtx = createContext<Ctx | null>(null)

function load(): Content {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...defaultContent(), ...parsed }
    }
  } catch {
    /* ignore */
  }
  return defaultContent()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [c, setC] = useState<Content>(load)
  const [edit, setEdit] = useState(false)
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    setSaved(false)
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(c))
      } catch {
        /* quota */
      }
      setSaved(true)
    }, 350)
    return () => clearTimeout(t)
  }, [c])

  useEffect(() => {
    const r = document.documentElement
    r.dataset.theme = c.settings.theme
    r.dataset.accent = c.settings.accent
  }, [c.settings])

  const update = useCallback((fn: (d: Content) => void) => {
    setC((prev) => {
      const d = structuredClone(prev)
      fn(d)
      return d
    })
  }, [])
  const replace = useCallback((n: Content) => setC({ ...defaultContent(), ...n }), [])
  const reset = useCallback(() => {
    localStorage.removeItem(KEY)
    setC(defaultContent())
  }, [])

  const value = useMemo(() => ({ c, edit, setEdit, update, replace, reset, saved }), [c, edit, update, replace, reset, saved])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const v = useContext(StoreCtx)
  if (!v) throw new Error('StoreProvider missing')
  return v
}
