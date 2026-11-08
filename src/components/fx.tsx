import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { cx } from './Editable'

/** Neural-network particle field that reacts to the pointer. */
export function NeuralBg() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0
    let frame = 0
    let rgb = '224,169,95'
    const mouse = { x: -9999, y: -9999 }
    type P = { x: number; y: number; vx: number; vy: number; r: number }
    let pts: P[] = []

    const readColor = () => {
      const hex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      const m = /^#([0-9a-f]{6})$/i.exec(hex)
      if (m) {
        const n = parseInt(m[1], 16)
        rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
      }
    }
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(95, Math.floor((w * h) / 15000))
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }))
    }
    const move = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const leave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const draw = () => {
      frame++
      if (frame % 40 === 0) readColor()
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > w) p.vx *= -1
          if (p.y < 0 || p.y > h) p.vy *= -1
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const d2 = dx * dx + dy * dy
          if (d2 < 22000 && d2 > 1) {
            p.x += dx * 0.004
            p.y += dy * 0.004
          }
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},0.55)`
        ctx.fill()
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d = dx * dx + dy * dy
          if (d < 15000) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / 15000) * 0.22})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
        const mx = p.x - mouse.x
        const my = p.y - mouse.y
        const md = mx * mx + my * my
        if (md < 32000) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - md / 32000) * 0.7})`
          ctx.lineWidth = 1.1
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    readColor()
    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [])
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden />
}

/** Soft glow following the cursor + sets --mx/--my on .spot cards. */
export function CursorGlow() {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 140, damping: 20, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 140, damping: 20, mass: 0.4 })
  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 250)
      y.set(e.clientY - 250)
      const spot = (e.target as HTMLElement | null)?.closest?.('.spot') as HTMLElement | null
      if (spot) {
        const r = spot.getBoundingClientRect()
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`)
        spot.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden h-[500px] w-[500px] rounded-full opacity-[0.16] blur-3xl md:block"
    >
      <div className="h-full w-full rounded-full bg-accent" />
    </motion.div>
  )
}

export function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const s = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  return <motion.div style={{ scaleX: s }} className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-accent" />
}

export function Reveal({ children, delay = 0, className, y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** 3D tilt following the pointer. */
export function Tilt({ children, className, max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), { stiffness: 160, damping: 16 })
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), { stiffness: 160, damping: 16 })
  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Letter-by-letter entrance. */
export function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={cx('inline-block', className)} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: '90%', opacity: 0, rotate: 8 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: delay + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  )
}

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const m = /^(\d+)(.*)$/.exec(value)
  const target = m ? parseInt(m[1], 10) : 0
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!m || !inView) return
    const a = animate(0, target, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => a.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target])
  if (!m) return <span ref={ref}>{value}</span>
  return (
    <span ref={ref}>
      {inView ? n : 0}
      {m[2]}
    </span>
  )
}

export function useTyped(phrases: string[], active: boolean) {
  const [text, setText] = useState('')
  const joined = phrases.join('|')
  useEffect(() => {
    if (!active || phrases.length === 0) return
    let i = 0
    let j = 0
    let del = false
    let t: ReturnType<typeof setTimeout>
    const tick = () => {
      const word = phrases[i % phrases.length]
      if (!del) {
        j++
        setText(word.slice(0, j))
        if (j >= word.length) {
          del = true
          t = setTimeout(tick, 1700)
          return
        }
        t = setTimeout(tick, 55)
      } else {
        j--
        setText(word.slice(0, j))
        if (j <= 0) {
          del = false
          i++
          t = setTimeout(tick, 350)
          return
        }
        t = setTimeout(tick, 28)
      }
    }
    t = setTimeout(tick, 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, active])
  return text
}
