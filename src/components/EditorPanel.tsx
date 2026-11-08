import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloudCheck, Download, ImagePlus, Moon, Pencil, RotateCcw, Sun, Upload, X, Check } from 'lucide-react'
import { useStore } from '../lib/store'
import type { Content } from '../lib/content'
import { cx } from './Editable'

const accents: { k: Content['settings']['accent']; col: string }[] = [
  { k: 'gold', col: '#e0a95f' },
  { k: 'mint', col: '#8fd3b0' },
  { k: 'rose', col: '#f0a3a3' },
  { k: 'sky', col: '#8fc3f0' },
]

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onerror = () => reject(new Error('read'))
    fr.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('img'))
      img.onload = () => {
        const max = 900
        const k = Math.min(1, max / Math.max(img.width, img.height))
        const cv = document.createElement('canvas')
        cv.width = Math.round(img.width * k)
        cv.height = Math.round(img.height * k)
        cv.getContext('2d')?.drawImage(img, 0, 0, cv.width, cv.height)
        resolve(cv.toDataURL('image/jpeg', 0.88))
      }
      img.src = String(fr.result)
    }
    fr.readAsDataURL(file)
  })
}

export default function EditorPanel() {
  const { c, edit, setEdit, update, replace, reset, saved } = useStore()
  const [open, setOpen] = useState(true)
  const [msg, setMsg] = useState('')
  const photoRef = useRef<HTMLInputElement>(null)
  const jsonRef = useRef<HTMLInputElement>(null)

  const flash = (t: string) => {
    setMsg(t)
    setTimeout(() => setMsg(''), 2500)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'portfolio-content.json'
    a.click()
    URL.revokeObjectURL(a.href)
    flash('Файл сохранён')
  }

  return (
    <div className="fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-3">
      <AnimatePresence>
        {edit && open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="w-[min(92vw,330px)] rounded-2xl border border-line bg-bg2/95 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="font-mono text-xs uppercase tracking-widest text-accent">Редактор</div>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <CloudCheck size={14} className={saved ? 'text-accent2' : 'text-muted'} />
                {saved ? 'Сохранено в браузере' : 'Сохраняю…'}
              </div>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-fg" aria-label="Свернуть">
                <X size={16} />
              </button>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-muted">
              Кликните на любой текст на странице и правьте. Enter — принять. Кнопки <span className="text-accent">+</span> добавляют, <span className="text-rose-400">×</span> удаляют элементы.
            </p>

            <div className="mb-3 grid grid-cols-2 gap-2">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update((d) => void (d.settings.theme = t))}
                  className={cx(
                    'flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition',
                    c.settings.theme === t ? 'border-accent bg-accent text-on-accent' : 'border-line hover:border-accent/60',
                  )}
                >
                  {t === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
                  {t === 'dark' ? 'Тёмная' : 'Светлая'}
                </button>
              ))}
            </div>

            <div className="mb-3 flex items-center justify-between rounded-xl border border-line px-3 py-2">
              <span className="text-sm text-muted">Цвет акцента</span>
              <div className="flex gap-2">
                {accents.map((a) => (
                  <button
                    key={a.k}
                    aria-label={a.k}
                    onClick={() => update((d) => void (d.settings.accent = a.k))}
                    className={cx('grid h-6 w-6 place-items-center rounded-full ring-offset-2 ring-offset-bg2 transition hover:scale-110', c.settings.accent === a.k && 'ring-2 ring-fg')}
                    style={{ background: a.col }}
                  >
                    {c.settings.accent === a.k && <Check size={12} className="text-black" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <button onClick={() => photoRef.current?.click()} className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 hover:border-accent">
                <ImagePlus size={15} /> Сменить фото
              </button>
              <button onClick={exportJson} className="flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 hover:border-accent">
                <Download size={15} /> Экспорт
              </button>
              <button onClick={() => jsonRef.current?.click()} className="flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 hover:border-accent">
                <Upload size={15} /> Импорт
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Сбросить все изменения к исходному резюме?')) {
                    reset()
                    flash('Восстановлено исходное содержание')
                  }
                }}
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-rose-400/40 px-3 py-2 text-rose-400 hover:bg-rose-500/10"
              >
                <RotateCcw size={15} /> Сбросить всё
              </button>
            </div>
            {msg && <div className="mt-3 text-center text-xs text-accent2">{msg}</div>}

            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                try {
                  const url = await resizeImage(f)
                  update((d) => void (d.photo = url))
                  flash('Фото обновлено')
                } catch {
                  flash('Не удалось загрузить фото')
                }
                e.target.value = ''
              }}
            />
            <input
              ref={jsonRef}
              type="file"
              accept="application/json"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                try {
                  replace(JSON.parse(await f.text()))
                  flash('Данные импортированы')
                } catch {
                  flash('Неверный файл')
                }
                e.target.value = ''
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setEdit(!edit)
          setOpen(true)
        }}
        className={cx(
          'group flex items-center gap-2.5 rounded-full px-5 py-3.5 text-sm font-medium shadow-2xl transition hover:-translate-y-0.5',
          edit ? 'bg-accent2 text-on-accent' : 'bg-accent text-on-accent',
        )}
        style={{ boxShadow: '0 10px 40px -10px var(--accent)' }}
      >
        {edit ? <Check size={18} /> : <Pencil size={18} />}
        {edit ? 'Готово' : 'Редактировать'}
      </button>
    </div>
  )
}
