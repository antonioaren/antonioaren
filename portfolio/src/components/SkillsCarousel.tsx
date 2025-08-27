import { useId, useMemo, useRef, useState, useEffect } from 'react'
import './SkillsCarousel.css'

export type SkillItem = {
  name: string
  color?: string
  logoUrl?: string
}

type SkillsCarouselProps = {
  title?: string
  items: SkillItem[]
  visibleCount?: number
  autoPlayMs?: number | null
}

export function SkillsCarousel({
  title = 'Tech I enjoy',
  items,
  visibleCount = 6,
  autoPlayMs = 3000,
}: SkillsCarouselProps) {
  const carouselId = useId()
  const [index, setIndex] = useState(0)
  const autoPlayRef = useRef<number | null>(null)

  const clampedVisible = Math.max(1, Math.min(visibleCount, items.length))
  const pageCount = Math.ceil(items.length / clampedVisible)

  const pages = useMemo(() => {
    const result: SkillItem[][] = []
    for (let i = 0; i < items.length; i += clampedVisible) {
      result.push(items.slice(i, i + clampedVisible))
    }
    return result
  }, [items, clampedVisible])

  const goTo = (i: number) => setIndex((i + pageCount) % pageCount)
  const next = () => setIndex((prev) => (prev + 1) % pageCount)
  const prev = () => setIndex((prev) => (prev - 1 + pageCount) % pageCount)

  useEffect(() => {
    if (!autoPlayMs) return
    if (autoPlayRef.current) window.clearInterval(autoPlayRef.current)
    autoPlayRef.current = window.setInterval(next, autoPlayMs)
    return () => {
      if (autoPlayRef.current) window.clearInterval(autoPlayRef.current)
    }
  }, [autoPlayMs, pageCount])

  if (items.length === 0) return null

  return (
    <section aria-labelledby={`${carouselId}-label`} className="skills-carousel">
      <div className="skills-header">
        <h2 id={`${carouselId}-label`}>{title}</h2>
        <div className="skills-controls">
          <button aria-label="Previous" onClick={prev} data-testid="prev-btn">
            ‹
          </button>
          <button aria-label="Next" onClick={next} data-testid="next-btn">
            ›
          </button>
        </div>
      </div>

      <div
        className="viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
      >
        <ul className="track" data-index={index}>
          {pages[index]?.map((item, i) => (
            <li key={`${item.name}-${i}`} className="slide">
              {item.logoUrl ? (
                <img src={item.logoUrl} alt={item.name} />
              ) : (
                <span className="badge" style={{ background: item.color || '#222' }}>
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {pageCount > 1 && (
        <div className="dots" role="tablist" aria-label={`${title} pages`}>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-controls={`${carouselId}-panel-${i}`}
              className={i === index ? 'active' : ''}
              onClick={() => goTo(i)}
              data-testid={`dot-${i}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default SkillsCarousel

