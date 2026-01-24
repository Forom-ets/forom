import { motion } from 'framer-motion'

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
  const activeIndex = items.findIndex((item) => item.id === activeId)

  return (
    <motion.aside
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-40"
    >
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
            className={`text-left transition-all ${
              isActive
                ? `text-xl font-black ${CATEGORY_COLORS[item.id] || 'text-gray-900'}`
                : item.disabled
                ? 'text-gray-300 cursor-not-allowed text-sm'
                : 'text-gray-600 hover:text-gray-900 text-sm'
            }`}
          >
            {item.label}
          </motion.button>
        )
      })}
    </motion.aside>
  )
}
