import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

// =============================================================================
// TYPES
// =============================================================================

interface SidebarItem {
  id: string
  label: string
  disabled?: boolean
}

interface SidebarProps {
  items: SidebarItem[]
  activeId: string
  onSelect: (id: string) => void
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Vertical spacing between category items in pixels */
const ITEM_SPACING = 75

/** Horizontal curve intensity for non-active items */
const CURVE_INTENSITY = 12

// =============================================================================
// COMPONENT
// =============================================================================

export function Sidebar({ items, activeId, onSelect }: SidebarProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const activeIndex = items.findIndex((item) => item.id === activeId)

  // Handle mouse wheel scrolling for category navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!wheelRef.current?.contains(e.target as Node)) return

      e.preventDefault()
      const currentIndex = items.findIndex((item) => item.id === activeId)
      if (currentIndex === -1) return

      const nextIndex = e.deltaY > 0
        ? Math.min(currentIndex + 1, items.length - 1)
        : Math.max(currentIndex - 1, 0)

      if (nextIndex !== currentIndex) {
        onSelect(items[nextIndex].id)
      }
    }

    const wheel = wheelRef.current
    if (wheel) {
      wheel.addEventListener('wheel', handleWheel, { passive: false })
      return () => wheel.removeEventListener('wheel', handleWheel)
    }
  }, [items, activeId, onSelect])

  return (
    <motion.div
      ref={wheelRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-1/2 flex items-center z-40"
      style={{ width: '400px', height: '400px', transform: 'translate(-65%, -50%)' }}
    >
      {/* Decorative Wheel Circle */}
      <div
        className="absolute rounded-full w-full h-full left-0"
        style={{
          border: '3px solid #9ca3af',
          background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
        }}
      />

      {/* Category List */}
      <div
        className="absolute flex flex-col items-start"
        style={{ left: '420px', top: '50%', transform: 'translateY(-50%)' }}
      >
        {items.map((item, index) => {
          const isActive = activeId === item.id
          const relativeIndex = index - activeIndex
          const distanceFromCenter = Math.abs(relativeIndex)

          // Calculate position and styling based on distance from active item
          const y = relativeIndex * ITEM_SPACING
          const xOffset = -distanceFromCenter * distanceFromCenter * CURVE_INTENSITY
          const opacity = distanceFromCenter === 0 ? 1 : distanceFromCenter === 1 ? 0.6 : 0.35

          return (
            <motion.button
              key={item.id}
              onClick={() => onSelect(item.id)}
              animate={{ y, x: xOffset, opacity }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              className="absolute whitespace-nowrap text-left"
              style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: isActive ? '3rem' : '1.75rem',
                fontWeight: isActive ? 900 : 400,
                fontStyle: isActive ? 'normal' : 'italic',
                color: isActive ? '#000000' : '#9CA3AF',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                outline: 'none',
              }}
            >
              {item.label}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
