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
    <>
      {/* Dark background panel on the left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed left-0 top-0 bottom-0 w-20 bg-gray-800 z-30"
      />

      {/* Wheel Container - Centered vertically on left side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        ref={wheelRef}
        className="fixed top-1/2 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto z-40"
        style={{
          width: '40vh',
          height: '40vh',
          left: '-15vh',
          top: '50%',
          transform: 'translateY(-50%)',
          aspectRatio: '1',
        }}
      >
        {/* Grey Wheel Circle */}
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: '100%',
            height: '100%',
            border: '2px solid #9ca3af',
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.1), transparent)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.1)'
          }}
        />

        {/* Categories positioned around the visible portion of wheel */}
        {items.map((item, index) => {
          const isActive = activeId === item.id
          const totalItems = items.length
          const angle = (index / totalItems) * 360
          const radius = 50 // percentage from center

          // Convert angle to radians for positioning
          const rad = (angle * Math.PI) / 180
          const x = radius * Math.cos(rad - Math.PI / 2)
          const y = radius * Math.sin(rad - Math.PI / 2)

          return (
            <motion.button
              key={item.id}
              onClick={() => !item.disabled && onSelect(item.id)}
              disabled={item.disabled}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isActive ? 1 : item.disabled ? 0.3 : 0.6,
                scale: isActive ? 1.15 : 0.85,
              }}
              transition={{
                type: 'spring',
                damping: 12,
                stiffness: 100,
              }}
              className={`absolute whitespace-nowrap font-bold transition-all ${
                isActive
                  ? `px-4 py-2 rounded-lg border-2 ${CATEGORY_COLORS[item.id] || 'text-gray-900'} border-current shadow-lg`
                  : item.disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : `${CATEGORY_COLORS[item.id] || 'text-gray-700'} hover:scale-105`
              }`}
              style={{
                fontSize: isActive ? 'clamp(1.25rem, 4vw, 2.5rem)' : 'clamp(0.875rem, 2.5vw, 1.5rem)',
                left: `calc(50% + ${x}%)`,
                top: `calc(50% + ${y}%)`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto',
              }}
            >
              {item.label}
            </motion.button>
          )
        })}
      </motion.div>
    </>
  )
}
