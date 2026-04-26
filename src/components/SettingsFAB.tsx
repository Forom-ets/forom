import { motion } from 'framer-motion'
import matrixIcon from '../assets/icons/matrix.svg'

// =============================================================================
// COMPONENT
// =============================================================================

interface SettingsFABProps {
  onClick: () => void
  visible?: boolean
}

export function SettingsFAB({ onClick, visible = true }: SettingsFABProps) {
  if (!visible) return null
  return (
    <div className="flex flex-col items-center">
      <motion.button
        onClick={onClick}
        className="relative select-none cursor-pointer flex items-center justify-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        style={{ background: 'none', border: 'none' }}
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 480, damping: 28 }}
        aria-label="Settings"
        title="Settings"
      >
        <img 
          src={matrixIcon} 
          alt="Settings Matrix" 
          className="w-[42px] h-[42px]"
          draggable={false} 
        />
      </motion.button>
    </div>
  )
}

