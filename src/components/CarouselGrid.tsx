import { useState, useRef, useEffect } from 'react'
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

/** Maximum horizontal scroll index (20 rectangles per row - 5 visible = 15) */
const MAX_HORIZONTAL_INDEX = 19

/** Shared styles for navigation buttons */
const navButtonStyle: React.CSSProperties = {
  fontFamily: "'Jersey 15', sans-serif",
  fontSize: '42px',
  color: 'black',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  lineHeight: 1,
  padding: '8px',
  userSelect: 'none',
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CarouselGrid({
  categories,
  activeCategory,
  onCategoryChange,
}: CarouselGridProps) {
  // Start at position 10 so center rectangle shows 10 (middle of 0-19)
  const [horizontalIndex, setHorizontalIndex] = useState(10)
  const activeIndex = categories.indexOf(activeCategory)
  const gridRef = useRef<HTMLDivElement | null>(null)

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
    // Don't go below 0 (leftmost column shows 0)
    if (horizontalIndex > 0) {
      setHorizontalIndex(horizontalIndex - 1)
    } else {
      setHorizontalIndex(MAX_HORIZONTAL_INDEX)
    }
  }

  const handleNextVideo = () => {
    if (horizontalIndex < MAX_HORIZONTAL_INDEX) {
      setHorizontalIndex(horizontalIndex + 1)
    } else {
      setHorizontalIndex(0)
    }
  }

  // Handle mouse wheel with resistance and cooldown to avoid rapid skips
  useEffect(() => {
    const THRESHOLD = 80 // required accumulated delta before action
    const COOLDOWN_MS = 450 // cooldown after a triggered navigation

    let acc = 0
    let cooling = false
    let lastAxis: 'x' | 'y' | null = null

    const handleWheel = (e: WheelEvent) => {
      if (!gridRef.current?.contains(e.target as Node)) return
      e.preventDefault()

      const isVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX)
      const axis = isVertical ? 'y' : 'x'
      const delta = isVertical ? e.deltaY : e.deltaX

      // Reset accumulator when axis changes
      if (lastAxis && lastAxis !== axis) acc = 0
      lastAxis = axis

      if (cooling) return

      acc += delta

      if (Math.abs(acc) >= THRESHOLD) {
        if (isVertical) {
          if (acc > 0) handleNextCategory()
          else handlePrevCategory()
        } else {
          if (acc > 0) handleNextVideo()
          else handlePrevVideo()
        }

        acc = 0
        cooling = true
        setTimeout(() => { cooling = false }, COOLDOWN_MS)
      }
    }

    const node = gridRef.current
    if (node) {
      node.addEventListener('wheel', handleWheel, { passive: false })
      return () => node.removeEventListener('wheel', handleWheel)
    }
  }, [handlePrevCategory, handleNextCategory, handlePrevVideo, handleNextVideo])

  /** Handle click on a video box to navigate to it */
  const handleBoxClick = (rowOffset: number, colOffset: number) => {
    // 1. Update Category if clicking a different row
    if (rowOffset !== 0) {
      const newRowIndex = activeIndex + rowOffset
      if (newRowIndex >= 0 && newRowIndex < categories.length) {
        onCategoryChange(categories[newRowIndex])
      }
    }

    // 2. Center the clicked video (update horizontal index)
    if (colOffset !== 0) {
      const newIndex = horizontalIndex + colOffset
      // Respect existing bounds (2 to MAX_HORIZONTAL_INDEX)
      if (newIndex >= 0 && newIndex <= MAX_HORIZONTAL_INDEX) {
        setHorizontalIndex(newIndex)
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------

  /** Renders a video placeholder box with responsive sizing */
  const renderVideoBox = (
    borderColor: string,
    num: number | null,
    isCentered = false,
    isSmall = false,
    isExtraSmall = false,
    onClick?: () => void
  ) => {
    // Don't render if num is null (out of bounds)
    const dimensions = isCentered
      ? { width: '14vw', height: '9.5vw', minWidth: '140px', minHeight: '95px' }
      : isExtraSmall
        ? { width: '3vw', height: '2vw', minWidth: '30px', minHeight: '20px' }
        : isSmall
          ? { width: '6vw', height: '4vw', minWidth: '60px', minHeight: '40px' }
          : { width: '8vw', height: '5.5vw', minWidth: '80px', minHeight: '55px' }

    if (num === null) {
      return <div style={{ ...dimensions, visibility: 'hidden' }} />
    }

    const fontSize = isCentered
      ? 'clamp(24px, 2.5vw, 48px)'
      : isExtraSmall
        ? 'clamp(8px, 1vw, 14px)'
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
        onClick={onClick}
        whileHover={onClick ? { scale: 1.05 } : undefined}
        style={{ 
          border: `3px solid ${borderColor}`, 
          ...dimensions,
          cursor: onClick ? 'pointer' : 'default'
        }}
      >
        <span className="font-bold text-gray-600" style={{ fontSize }}>
          {num}
        </span>
      </motion.div>
    )
  }

  /** Returns video number based on row offset and column position (0-99 total, 20 per row) */
  const getVideoNum = (rowOffset: number, col: number): number | null => {
    // Calculate the actual category index for this row
    const rowCategoryIndex = activeIndex + rowOffset
    // If out of bounds, return null (row should be hidden)
    if (rowCategoryIndex < 0 || rowCategoryIndex >= categories.length) return null
    // Each category has 20 numbers: category 0 = 0-19, category 1 = 20-39, etc.
    const baseNumber = rowCategoryIndex * 20
    const num = baseNumber + horizontalIndex + col
    
    // Strict bounds check: only return number if it belongs to this category's range
    // This ensures no "leaking" of numbers from adjacent categories into the current row
    if (num < baseNumber || num >= baseNumber + 20) return null
    
    return num
  }

  // ---------------------------------------------------------------------------
  // Grid Render Logic
  // ---------------------------------------------------------------------------

  const renderRow = (rowOffset: number, opacity: number, gap: string = '2vw') => {
    const rowColor = getRowColor(rowOffset)
    const isSmall = Math.abs(rowOffset) === 1
    const isExtraSmall = Math.abs(rowOffset) === 2
    
    return (
      <motion.div 
        key={rowOffset}
        className="flex items-center justify-center"
        style={{ gap }}
        animate={{ opacity }}
      >
        {[-2, -1, 0, 1, 2].map((col) => {
          // Center box of the middle row gets special treatment
          const isCentered = rowOffset === 0 && col === 0
          return (
            <div key={`${rowOffset}-${col}`}>
              {renderVideoBox(
                rowColor,
                getVideoNum(rowOffset, col),
                isCentered,
                isSmall,
                isExtraSmall,
                () => handleBoxClick(rowOffset, col)
              )}
            </div>
          )
        })}
      </motion.div>
    )
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      style={{ paddingLeft: '22vw', paddingRight: '22vw', paddingTop: '10vh', paddingBottom: '22vh' }}
    >
      {/* Main Content - Grid centered, Vertical Navigation positioned separately */}
      <div ref={gridRef} className="relative flex items-center justify-center pointer-events-auto">
        {/* 5x5 Grid - centered */}
        <div className="flex flex-col items-center" style={{ gap: '1.5vh' }}>
          {/* Extra Top Row (-2) */}
          {renderRow(-2, 0.5)}

          {/* Second Top Row (-1) */}
          {renderRow(-1, 0.7)}

          {/* Middle Row (0) - Active with larger center box */}
          {renderRow(0, 1)}

          {/* Second Bottom Row (+1) */}
          {renderRow(1, 0.7, '3vw')}

          {/* Extra Bottom Row (+2) */}
          {renderRow(2, 0.5)}
        </div>

        {/* Vertical Navigation - positioned to the right of grid */}
        <nav
          className="absolute flex flex-col items-center justify-center pointer-events-auto"
          style={{ gap: '15px', left: '100%', marginLeft: '3vw' }}
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
        style={{ marginTop: '5vh', gap: '30px' }}
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
