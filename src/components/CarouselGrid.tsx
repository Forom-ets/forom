import { useState } from 'react'
import { motion } from 'framer-motion'

// =============================================================================
// TYPES
// =============================================================================

interface CarouselGridProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Color mapping for each category - defines border colors for video boxes */
const CATEGORY_COLORS: Record<string, string> = {
  Partenaires: '#86B89E',
  Culture: '#C084FC',
  Clubs: '#E85C5C',
  Trésorie: '#F4C98E',
  Atelier: '#60A5FA',
}

/** Fallback color for categories without defined colors */
const DEFAULT_COLOR = '#E5E7EB'

/** Maximum horizontal scroll index */
const MAX_HORIZONTAL_INDEX = 10

/** Shared styles for navigation buttons */
const navButtonStyle: React.CSSProperties = {
  fontFamily: "'Jersey 15', sans-serif",
  fontSize: '48px',
  color: 'black',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  lineHeight: 1,
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CarouselGrid({
  categories,
  activeCategory,
  onCategoryChange,
}: CarouselGridProps) {
  const [horizontalIndex, setHorizontalIndex] = useState(0)
  const activeIndex = categories.indexOf(activeCategory)

  // ---------------------------------------------------------------------------
  // Helper Functions
  // ---------------------------------------------------------------------------

  /** Returns the color for a row based on its offset from the active category */
  const getRowColor = (rowOffset: number): string => {
    const rowIndex = activeIndex + rowOffset
    if (rowIndex < 0 || rowIndex >= categories.length) return DEFAULT_COLOR
    return CATEGORY_COLORS[categories[rowIndex]] ?? DEFAULT_COLOR
  }

  // ---------------------------------------------------------------------------
  // Navigation Handlers
  // ---------------------------------------------------------------------------

  const handlePrevCategory = () => {
    if (activeIndex > 0) onCategoryChange(categories[activeIndex - 1])
  }

  const handleNextCategory = () => {
    if (activeIndex < categories.length - 1) onCategoryChange(categories[activeIndex + 1])
  }

  const handlePrevVideo = () => {
    if (horizontalIndex > 0) setHorizontalIndex(horizontalIndex - 1)
  }

  const handleNextVideo = () => {
    if (horizontalIndex < MAX_HORIZONTAL_INDEX) setHorizontalIndex(horizontalIndex + 1)
  }

  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------

  /** Renders a video placeholder box with responsive sizing */
  const renderVideoBox = (
    borderColor: string,
    num: number,
    isCentered = false,
    isSmall = false
  ) => {
    const dimensions = isCentered
      ? { width: '18vw', height: '12vw', minWidth: '180px', minHeight: '120px' }
      : isSmall
        ? { width: '8vw', height: '5.5vw', minWidth: '80px', minHeight: '55px' }
        : { width: '10vw', height: '7vw', minWidth: '100px', minHeight: '70px' }

    const fontSize = isCentered
      ? 'clamp(24px, 2.5vw, 48px)'
      : isSmall
        ? 'clamp(14px, 1.5vw, 24px)'
        : 'clamp(16px, 1.8vw, 28px)'

    return (
      <motion.div
        key={num}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className="relative rounded-sm overflow-hidden bg-pink-100 flex items-center justify-center"
        style={{ border: `3px solid ${borderColor}`, ...dimensions }}
      >
        <span className="font-bold text-gray-600" style={{ fontSize }}>
          {num}
        </span>
      </motion.div>
    )
  }

  /** Returns video number based on column position and horizontal scroll */
  const getVideoNum = (col: number): number => horizontalIndex + col + 1

  // Pre-compute row colors for performance
  const topRowColor = getRowColor(-1)
  const middleRowColor = getRowColor(0)
  const bottomRowColor = getRowColor(1)

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
            {renderVideoBox(topRowColor, getVideoNum(0), false, true)}
            {renderVideoBox(topRowColor, getVideoNum(1), false, true)}
            {renderVideoBox(topRowColor, getVideoNum(2), false, true)}
          </motion.div>

          {/* Middle Row - Active with larger center box */}
          <div className="flex items-center justify-center" style={{ gap: '5vw' }}>
            {renderVideoBox(middleRowColor, getVideoNum(0))}
            {renderVideoBox(middleRowColor, getVideoNum(1), true)}
            {renderVideoBox(middleRowColor, getVideoNum(2))}
          </div>

          {/* Bottom Row */}
          <motion.div 
            className="flex justify-center"
            style={{ gap: '5vw' }}
            animate={{ opacity: activeIndex < categories.length - 1 ? 1 : 0.3 }}
          >
            {renderVideoBox(bottomRowColor, getVideoNum(0), false, true)}
            {renderVideoBox(bottomRowColor, getVideoNum(1), false, true)}
            {renderVideoBox(bottomRowColor, getVideoNum(2), false, true)}
          </motion.div>
        </div>

        {/* Vertical Navigation - positioned to the right of grid */}
        <nav
          className="absolute flex flex-col items-center justify-center"
          style={{ gap: '20px', left: '100%', marginLeft: '5vw' }}
          aria-label="Category navigation"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevCategory}
            className="nav-button"
            style={navButtonStyle}
            aria-label="Previous category"
          >
            ^
          </motion.button>

          {/* Vertical Slider Track */}
          <div
            className="flex flex-col items-center justify-center relative"
            style={{ height: '200px', width: '24px' }}
          >
            <div className="absolute w-[3px] h-full bg-black left-1/2 -translate-x-1/2" />
            <motion.div
              className="absolute w-6 h-6 rounded-full bg-black left-1/2 -translate-x-1/2"
              animate={{ top: `${(activeIndex / Math.max(1, categories.length - 1)) * 100}%` }}
              transition={{ type: 'spring', damping: 15, stiffness: 150 }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextCategory}
            style={navButtonStyle}
            aria-label="Next category"
          >
            v
          </motion.button>
        </nav>
      </div>

      {/* Horizontal Navigation - Below Grid */}
      <nav
        className="flex items-center justify-center pointer-events-auto"
        style={{ marginTop: '10vh', gap: '40px' }}
        aria-label="Video navigation"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevVideo}
          style={navButtonStyle}
          aria-label="Previous video"
        >
          {'<'}
        </motion.button>

        {/* Horizontal Slider Track */}
        <div className="flex items-center justify-center relative" style={{ width: '300px', height: '24px' }}>
          <div className="absolute w-full h-[3px] bg-black top-1/2 -translate-y-1/2" />
          <motion.div
            className="absolute w-6 h-6 rounded-full bg-black top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ left: `${(horizontalIndex / MAX_HORIZONTAL_INDEX) * 100}%` }}
            transition={{ type: 'spring', damping: 15, stiffness: 150 }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextVideo}
          style={navButtonStyle}
          aria-label="Next video"
        >
          {'>'}
        </motion.button>
      </nav>
    </div>
  )
}
