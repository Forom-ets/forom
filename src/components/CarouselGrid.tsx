import React from 'react'
import { motion } from 'framer-motion'

interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  views: string
  channel: string
}

interface CarouselGridProps {
  videos: Video[]
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

// Category color mapping - each category has its own color
const CATEGORY_COLORS: Record<string, string> = {
  Partenaires: '#86B89E', // green
  Culture: '#C084FC', // purple
  Clubs: '#E85C5C', // red
  Trésorie: '#F4C98E', // orange/yellow
  Atelier: '#60A5FA', // blue
}

export function CarouselGrid({
  categories,
  activeCategory,
  onCategoryChange,
}: CarouselGridProps) {
  const [horizontalIndex, setHorizontalIndex] = React.useState(0)
  const activeIndex = categories.indexOf(activeCategory)

  // Get colors for top, middle (active), and bottom rows
  const getRowColor = (rowOffset: number) => {
    const rowIndex = activeIndex + rowOffset
    if (rowIndex < 0 || rowIndex >= categories.length) return '#E5E7EB' // gray for out of bounds
    return CATEGORY_COLORS[categories[rowIndex]] || '#E5E7EB'
  }

  // Handlers for category navigation
  const handlePrevCategory = () => {
    if (activeIndex > 0) {
      onCategoryChange(categories[activeIndex - 1])
    }
  }

  const handleNextCategory = () => {
    if (activeIndex < categories.length - 1) {
      onCategoryChange(categories[activeIndex + 1])
    }
  }

  // Handlers for horizontal navigation
  const handlePrevVideo = () => {
    if (horizontalIndex > 0) {
      setHorizontalIndex(horizontalIndex - 1)
    }
  }

  const handleNextVideo = () => {
    if (horizontalIndex < 10) {
      setHorizontalIndex(horizontalIndex + 1)
    }
  }

  /**
   * Renders a video placeholder box
   */
  const renderVideoBox = (borderColor: string, isCentered: boolean = false, isSmall: boolean = false) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 12, stiffness: 100 }}
      className="relative rounded-sm overflow-hidden bg-pink-100 flex items-center justify-center"
      style={{
        border: `3px solid ${borderColor}`,
        width: isCentered ? '280px' : isSmall ? '120px' : '140px',
        height: isCentered ? '180px' : isSmall ? '80px' : '90px',
      }}
    >
      {isCentered && (
        <div className="bg-red-600 rounded-lg p-3">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </motion.div>
  )

  const topRowColor = getRowColor(-1)
  const middleRowColor = getRowColor(0)
  const bottomRowColor = getRowColor(1)

  return (
    <div className="flex-1 flex flex-col items-center justify-center" style={{ marginLeft: '160px' }}>
      {/* Main Content - Grid + Vertical Navigation */}
      <div className="flex items-center gap-12">
        {/* 3x3 Grid */}
        <div className="flex flex-col items-center gap-4">
          {/* Top Row */}
          <motion.div 
            className="flex gap-8 justify-center"
            animate={{ opacity: activeIndex > 0 ? 1 : 0.3 }}
          >
            {renderVideoBox(topRowColor, false, true)}
            {renderVideoBox(topRowColor, false, true)}
            {renderVideoBox(topRowColor, false, true)}
          </motion.div>

          {/* Middle Row - Active with larger center box */}
          <div className="flex gap-6 items-center justify-center">
            {renderVideoBox(middleRowColor)}
            {renderVideoBox(middleRowColor, true)}
            {renderVideoBox(middleRowColor)}
          </div>

          {/* Bottom Row */}
          <motion.div 
            className="flex gap-8 justify-center"
            animate={{ opacity: activeIndex < categories.length - 1 ? 1 : 0.3 }}
          >
            {renderVideoBox(bottomRowColor, false, true)}
            {renderVideoBox(bottomRowColor, false, true)}
            {renderVideoBox(bottomRowColor, false, true)}
          </motion.div>
        </div>

        {/* Vertical Navigation */}
        <div className="flex flex-col items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevCategory}
            className="text-black text-2xl font-bold"
            aria-label="Previous category"
          >
            ^
          </motion.button>

          {/* Vertical slider */}
          <div className="flex flex-col items-center justify-center relative" style={{ height: '140px', width: '8px' }}>
            <div style={{ position: 'absolute', width: '2px', height: '100%', backgroundColor: 'black', left: '50%', transform: 'translateX(-50%)' }} />
            <motion.div
              style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: 'black', 
                position: 'absolute', 
                left: '50%', 
                transform: 'translateX(-50%)',
              }}
              animate={{
                top: `${(activeIndex / Math.max(1, categories.length - 1)) * 100}%`,
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 150 }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextCategory}
            className="text-black text-2xl font-bold"
            aria-label="Next category"
          >
            v
          </motion.button>
        </div>
      </div>

      {/* Horizontal Navigation - Below Grid */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevVideo}
          className="text-black text-xl"
          aria-label="Previous"
        >
          {'<'}
        </motion.button>

        {/* Horizontal slider */}
        <div className="flex items-center justify-center relative" style={{ width: '160px', height: '8px' }}>
          <div style={{ position: 'absolute', width: '100%', height: '2px', backgroundColor: 'black', top: '50%', transform: 'translateY(-50%)' }} />
          <motion.div
            style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: 'black', 
              position: 'absolute', 
              top: '50%', 
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              left: `${(horizontalIndex / 10) * 100}%`,
            }}
            transition={{ type: 'spring', damping: 15, stiffness: 150 }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextVideo}
          className="text-black text-xl"
          aria-label="Next"
        >
          {'>'}
        </motion.button>
      </div>
    </div>
  )
}
