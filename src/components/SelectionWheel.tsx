import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface SelectionWheelProps {
  totalItems: number
  currentIndex: number
  onUp: () => void
  onDown: () => void
}

export function SelectionWheel({
  totalItems,
  currentIndex,
  onUp,
  onDown,
}: SelectionWheelProps) {
  // Calculate the position of the slider based on current index
  const sliderPosition = (currentIndex / Math.max(1, totalItems - 1)) * 100

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed right-0 top-0 h-full flex flex-col items-center justify-center pr-8 pointer-events-none z-30"
    >
      {/* Container for the selection wheel */}
      <div className="flex flex-col items-center gap-8 pointer-events-auto">
        {/* Up Arrow Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUp}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
          aria-label="Previous item"
        >
          <ChevronUp size={24} strokeWidth={2} />
        </motion.button>

        {/* Vertical Slider Track */}
        <div className="relative h-64 w-1 bg-gray-300 rounded-full overflow-hidden">
          {/* Slider Position Indicator */}
          <motion.div
            animate={{ top: `${sliderPosition}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute w-3 h-3 bg-gray-700 rounded-full transform -translate-x-1 -translate-y-1/2"
            style={{
              left: '50%',
            }}
          />
        </div>

        {/* Down Arrow Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDown}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
          aria-label="Next item"
        >
          <ChevronDown size={24} strokeWidth={2} />
        </motion.button>
      </div>

      {/* Optional: Index indicator */}
      <motion.div
        animate={{ opacity: 0.6 }}
        className="mt-8 text-xs text-gray-500 font-medium"
      >
        {currentIndex + 1} / {totalItems}
      </motion.div>
    </motion.div>
  )
}
