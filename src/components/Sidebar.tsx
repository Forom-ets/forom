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

// Color mapping for each category
const CATEGORY_COLORS: Record<string, string> = {
  Partenaires: '#9CA3AF', // gray
  Culture: '#374151', // darker gray
  Clubs: '#000000', // black (active)
  Trésorie: '#6B7280', // gray
  Atelier: '#9CA3AF', // light gray
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

  // Calculate position for each category on the wheel
  const getItemPosition = (index: number) => {
    const activeIndex = items.findIndex((item) => item.id === activeId)
    const relativeIndex = index - activeIndex
    
    // Vertical spacing between items
    const spacing = 80
    const y = relativeIndex * spacing
    
    return { y }
  }

  return (
    <motion.div
      ref={wheelRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-1/2 flex items-center justify-end cursor-grab active:cursor-grabbing z-40"
      style={{
        width: '320px',
        height: '320px',
        transform: 'translate(-50%, -50%)',
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
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.1)',
        }}
      />

      {/* Categories positioned vertically */}
      <div 
        className="relative flex flex-col items-start justify-center"
        style={{ 
          marginLeft: '180px',
          height: '100%',
        }}
      >
        {items.map((item, index) => {
          const isActive = activeId === item.id
          const { y } = getItemPosition(index)
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSelect(item.id)}
              animate={{
                y,
                opacity: Math.abs(y) > 120 ? 0.3 : 1,
                scale: isActive ? 1 : 0.85,
              }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 150,
              }}
              className="absolute whitespace-nowrap text-left transition-colors"
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: isActive ? '2.5rem' : '1.5rem',
                fontWeight: isActive ? 900 : 400,
                fontStyle: isActive ? 'normal' : 'italic',
                color: CATEGORY_COLORS[item.id] || '#6B7280',
                cursor: 'pointer',
                left: 0,
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
