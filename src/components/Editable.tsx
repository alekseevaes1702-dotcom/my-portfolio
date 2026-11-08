import type { ElementType, ReactNode } from 'react'
import { Plus, X } from 'lucide-react'
import { useStore } from '../lib/store'

export const cx = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(' ')

interface ETProps {
  value: string
  onChange: (v: string) => void
  as?: ElementType
  className?: string
  placeholder?: string
}

/** Text that becomes inline-editable when edit mode is on. */
export function ET({ value, onChange, as = 'span', className, placeholder = 'Введите текст' }: ETProps) {
  const { edit } = useStore()
  const Tag = as as ElementType
  if (!edit) return <Tag className={className}>{value}</Tag>
  return (
    <Tag
      className={cx(className, 'edit-field')}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
      onClick={(e: React.MouseEvent) => e.preventDefault()}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const t = e.currentTarget.innerText.replace(/\s*\n+\s*/g, ' ').trim()
        if (t !== value) onChange(t)
        else e.currentTarget.innerText = value
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
    >
      {value}
    </Tag>
  )
}

export function DelBtn({ onClick, className, label = 'Удалить' }: { onClick: () => void; className?: string; label?: string }) {
  const { edit } = useStore()
  if (!edit) return null
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cx(
        'grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-500 text-white shadow-md transition hover:scale-110',
        className,
      )}
    >
      <X size={13} strokeWidth={3} />
    </button>
  )
}

export function AddBtn({ onClick, children, className }: { onClick: () => void; children: ReactNode; className?: string }) {
  const { edit } = useStore()
  if (!edit) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-accent/70 px-4 py-2.5 text-sm text-accent transition hover:bg-accent hover:text-on-accent',
        className,
      )}
    >
      <Plus size={16} />
      {children}
    </button>
  )
}
