import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

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

export function Sidebar({ items, activeId, onSelect }: SidebarProps) {
  const wheelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!wheelRef.current?.contains(e.target as Node)) return
      
      e.preventDefault()
      const currentIndex = items.findIndex((item) => item.id === activeId)
      
      if (currentIndex === -1) return
      
      let nextIndex = currentIndex
      if (e.deltaY > 0) {
        // Scroll down - go to next category
        nextIndex = Math.min(currentIndex + 1, items.length - 1)
      } else {
        // Scroll up - go to previous category
        nextIndex = Math.max(currentIndex - 1, 0)
      }
      
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

  const activeIndex = items.findIndex((item) => item.id === activeId)

  return (
    <motion.div
      ref={wheelRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-1/2 flex items-center z-40"
      style={{
        width: '400px',
        height: '400px',
        transform: 'translate(-65%, -50%)',
      }}
    >
      {/* Grey Wheel Circle */}
      <div
        className="absolute rounded-full"
        style={{
          width: '100%',
          height: '100%',
          left: 0,
          border: '3px solid #9ca3af',
          background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
        }}
      />

      {/* Categories positioned vertically, flowing around the wheel */}
      <div 
        className="absolute flex flex-col items-start"
        style={{ 
          left: '420px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        {items.map((item, index) => {
          const isActive = activeId === item.id
          const relativeIndex = index - activeIndex
          
          // Calculate vertical position - active item centered
          const spacing = 75
          const y = relativeIndex * spacing
          
          // Calculate horizontal offset based on distance from active (curve effect)
          // Negative offset - items curve to the LEFT as they get further from center
          const distanceFromCenter = Math.abs(relativeIndex)
          const xOffset = -distanceFromCenter * distanceFromCenter * 12
          
          // Opacity based on distance
          const opacity = distanceFromCenter === 0 ? 1 : distanceFromCenter === 1 ? 0.6 : 0.35
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSelect(item.id)}
              animate={{
                y,
                x: xOffset,
                opacity,
              }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 150,
              }}
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
