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
   * Renders a video placeholder box with responsive sizing
   */
  const renderVideoBox = (borderColor: string, num: number, isCentered: boolean = false, isSmall: boolean = false) => (
    <motion.div
      key={num}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 12, stiffness: 100 }}
      className="relative rounded-sm overflow-hidden bg-pink-100 flex items-center justify-center"
      style={{
        border: `3px solid ${borderColor}`,
        width: isCentered ? '18vw' : isSmall ? '8vw' : '10vw',
        height: isCentered ? '12vw' : isSmall ? '5.5vw' : '7vw',
        minWidth: isCentered ? '180px' : isSmall ? '80px' : '100px',
        minHeight: isCentered ? '120px' : isSmall ? '55px' : '70px',
      }}
    >
      <span 
        className="font-bold text-gray-600"
        style={{ fontSize: isCentered ? 'clamp(24px, 2.5vw, 48px)' : isSmall ? 'clamp(14px, 1.5vw, 24px)' : 'clamp(16px, 1.8vw, 28px)' }}
      >
        {num}
      </span>
    </motion.div>
  )

  const topRowColor = getRowColor(-1)
  const middleRowColor = getRowColor(0)
  const bottomRowColor = getRowColor(1)

  // Calculate video numbers based on horizontal scroll position
  // Each row has its own set of videos that shift with horizontal scroll
  const getVideoNum = (_row: number, col: number) => {
    // row: 0 = top, 1 = middle, 2 = bottom
    // col: 0 = left, 1 = center, 2 = right
    const baseNum = horizontalIndex + col + 1 // col 0 = left video, col 1 = center, col 2 = right
    return baseNum
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      style={{ paddingLeft: '25vw', paddingRight: '10vw', paddingTop: '20vh', paddingBottom: '10vh' }}
    >
      {/* Main Content - Grid centered, Vertical Navigation positioned separately */}
      <div className="relative flex items-center justify-center pointer-events-auto">
        {/* 3x3 Grid - centered */}
        <div className="flex flex-col items-center" style={{ gap: '3vh' }}>
          {/* Top Row */}
          <motion.div 
            className="flex justify-center"
            style={{ gap: '5vw' }}
            animate={{ opacity: activeIndex > 0 ? 1 : 0.3 }}
          >
            {renderVideoBox(topRowColor, getVideoNum(0, 0), false, true)}
            {renderVideoBox(topRowColor, getVideoNum(0, 1), false, true)}
            {renderVideoBox(topRowColor, getVideoNum(0, 2), false, true)}
          </motion.div>

          {/* Middle Row - Active with larger center box */}
          <div className="flex items-center justify-center" style={{ gap: '5vw' }}>
            {renderVideoBox(middleRowColor, getVideoNum(1, 0))}
            {renderVideoBox(middleRowColor, getVideoNum(1, 1), true)}
            {renderVideoBox(middleRowColor, getVideoNum(1, 2))}
          </div>

          {/* Bottom Row */}
          <motion.div 
            className="flex justify-center"
            style={{ gap: '5vw' }}
            animate={{ opacity: activeIndex < categories.length - 1 ? 1 : 0.3 }}
          >
            {renderVideoBox(bottomRowColor, getVideoNum(2, 0), false, true)}
            {renderVideoBox(bottomRowColor, getVideoNum(2, 1), false, true)}
            {renderVideoBox(bottomRowColor, getVideoNum(2, 2), false, true)}
          </motion.div>
        </div>

        {/* Vertical Navigation - positioned to the right of grid */}
        <div className="absolute flex flex-col items-center justify-center" style={{ gap: '20px', left: '100%', marginLeft: '5vw' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevCategory}
            style={{ 
              fontFamily: "'Jersey 15', sans-serif",
              fontSize: '48px',
              color: 'black',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              lineHeight: 1,
            }}
            aria-label="Previous category"
          >
            ^
          </motion.button>

          {/* Vertical slider */}
          <div className="flex flex-col items-center justify-center relative" style={{ height: '200px', width: '24px' }}>
            <div style={{ position: 'absolute', width: '3px', height: '100%', backgroundColor: 'black', left: '50%', transform: 'translateX(-50%)' }} />
            <motion.div
              style={{ 
                width: '24px', 
                height: '24px', 
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
            style={{ 
              fontFamily: "'Jersey 15', sans-serif",
              fontSize: '48px',
              color: 'black',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              lineHeight: 1,
            }}
            aria-label="Next category"
          >
            v
          </motion.button>
        </div>
      </div>

      {/* Horizontal Navigation - Below Grid */}
      <div 
        className="flex items-center justify-center pointer-events-auto"
        style={{ 
          marginTop: '10vh',
          gap: '40px',
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevVideo}
          style={{ 
            fontFamily: "'Jersey 15', sans-serif",
            fontSize: '48px',
            color: 'black',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            lineHeight: 1,
          }}
          aria-label="Previous"
        >
          {'<'}
        </motion.button>

        {/* Horizontal slider */}
        <div className="flex items-center justify-center relative" style={{ width: '300px', height: '24px' }}>
          <div style={{ position: 'absolute', width: '100%', height: '3px', backgroundColor: 'black', top: '50%', transform: 'translateY(-50%)' }} />
          <motion.div
            style={{ 
              width: '24px', 
              height: '24px', 
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
          style={{ 
            fontFamily: "'Jersey 15', sans-serif",
            fontSize: '48px',
            color: 'black',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            lineHeight: 1,
          }}
          aria-label="Next"
        >
          {'>'}
        </motion.button>
      </div>
    </div>
  )
}
