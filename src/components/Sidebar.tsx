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

// Color mapping for each category for visual distinction
const CATEGORY_COLORS: Record<string, string> = {
  Partenaires: 'text-green-500',
  Culture: 'text-purple-500',
  Clubs: 'text-red-600',
  Trésorerie: 'text-yellow-500',
  Atelier: 'text-blue-500',
}

export function Sidebar({ items, activeId, onSelect }: SidebarProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const activeIndex = items.findIndex((item) => item.id === activeId)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!wheelRef.current?.contains(e.target as Node)) return
      
      e.preventDefault()
      const enabledItems = items.filter((item) => !item.disabled)
      const currentEnabledIndex = enabledItems.findIndex((item) => item.id === activeId)
      
      if (currentEnabledIndex === -1) return
      
      let nextIndex = currentEnabledIndex
      if (e.deltaY > 0) {
        nextIndex = (currentEnabledIndex + 1) % enabledItems.length
      } else {
        nextIndex = (currentEnabledIndex - 1 + enabledItems.length) % enabledItems.length
      }
      
      onSelect(enabledItems[nextIndex].id)
    }

    const wheel = wheelRef.current
    if (wheel) {
      wheel.addEventListener('wheel', handleWheel, { passive: false })
      return () => wheel.removeEventListener('wheel', handleWheel)
    }
  }, [items, activeId, onSelect])

  return (
    <motion.aside
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 flex items-center gap-6 z-40"
    >
      {/* Grey Wheel/Circle */}
      <div
        ref={wheelRef}
        className="relative w-40 h-screen flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border-gray-400 flex items-center justify-center hover:border-gray-600 transition-colors"
          style={{
            width: '25vw',
            height: '25vw',
            borderWidth: '2vw',
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.1), transparent)',
            boxShadow: '0 0 0 calc(2vw * 1) rgba(59, 130, 246, 0.4) inset, 0 10px 30px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{
            width: '1.5vw',
            height: '1.5vw',
            borderRadius: '50%',
            backgroundColor: '#4b5563'
          }}></div>
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="flex flex-col gap-12">
        {items.map((item, index) => {
          const isActive = activeId === item.id
          const distance = Math.abs(index - activeIndex)

          // Calculate animation values based on proximity to active item
          let translateX = 0
          let scale = 0.8
          let opacity = 0.4

          if (isActive) {
            translateX = 20
            scale = 1.2
            opacity = 1
          } else if (distance === 1) {
            translateX = 10
            scale = 1.0
            opacity = 0.7
          }

          return (
            <motion.button
              key={item.id}
              onClick={() => !item.disabled && onSelect(item.id)}
              disabled={item.disabled}
              initial={{ opacity: 0 }}
              animate={{
                opacity,
                x: translateX,
                scale,
              }}
              transition={{
                type: 'spring',
                damping: 12,
                stiffness: 100,
              }}
              className={`text-left transition-all [font-family:'Jersey_15'] ${
                isActive
                  ? `font-black ${CATEGORY_COLORS[item.id] || 'text-gray-900'}`
                  : item.disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-400 hover:text-gray-900'
              }`}
              style={{
                fontSize: isActive ? 'clamp(2rem, 8vw, 6rem)' : 'clamp(1.5rem, 6vw, 5rem)',
              }}
            >
              {item.label}
            </motion.button>
          )
        })}
      </div>
    </motion.aside>
  )
}
