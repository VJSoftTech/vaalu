import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Book } from '@/types'
import BookCard from './BookCard'

interface Props {
  books: Book[]
  autoPlayInterval?: number
}

function useItemsPerView() {
  const [itemsPerView, setItemsPerView] = useState(4)
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setItemsPerView(w < 640 ? 2 : w < 1024 ? 3 : 4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return itemsPerView
}

export default function BookCarousel({ books, autoPlayInterval = 3000 }: Props) {
  const rawItemsPerView = useItemsPerView()
  const itemsPerView = Math.max(1, Math.min(rawItemsPerView, books.length))
  const loop = books.length > itemsPerView

  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)

  // Extend the list with a leading clone of the first `itemsPerView` books so the
  // strip can slide past the last real book and snap back without a visible jump.
  const extended = loop ? [...books, ...books.slice(0, itemsPerView)] : books

  const next = useCallback(() => {
    setAnimate(true)
    setIndex((i) => i + 1)
  }, [])

  const prev = useCallback(() => {
    if (index === 0) {
      // Jump to the cloned tail (visually identical to index 0), then animate back one step.
      setAnimate(false)
      setIndex(books.length)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setAnimate(true)
        setIndex(books.length - 1)
      }))
      return
    }
    setAnimate(true)
    setIndex((i) => i - 1)
  }, [index, books.length])

  useEffect(() => {
    if (!loop) return
    const timer = setInterval(next, autoPlayInterval)
    return () => clearInterval(timer)
  }, [loop, next, autoPlayInterval])

  useEffect(() => {
    if (!loop || index !== books.length) return
    const el = trackRef.current
    if (!el) return
    const onEnd = () => {
      setAnimate(false)
      setIndex(0)
    }
    el.addEventListener('transitionend', onEnd, { once: true })
    return () => el.removeEventListener('transitionend', onEnd)
  }, [loop, index, books.length])

  // Re-enable the transition on the next frame after an instant (no-transition) snap.
  useEffect(() => {
    if (animate) return
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [animate])

  if (books.length === 0) return null

  const itemWidth = 100 / itemsPerView

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className={`flex ${animate ? 'transition-transform duration-500 ease-in-out' : ''}`}
          style={{ transform: `translateX(-${index * itemWidth}%)` }}
        >
          {extended.map((book, i) => (
            <div key={`${book.id}-${i}`} className="shrink-0 px-2" style={{ width: `${itemWidth}%` }}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>

      {loop && (
        <>
          <button
            onClick={prev}
            aria-label="Previous book"
            className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-1/2 z-10 bg-background hover:bg-muted text-foreground rounded-full p-2 shadow border"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next book"
            className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-1/2 z-10 bg-background hover:bg-muted text-foreground rounded-full p-2 shadow border"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )
}
