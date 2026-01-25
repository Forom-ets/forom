import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { VideoBox } from './VideoBox'
import { VideoModal } from './VideoModal'
import { getVideoId, getVideoData } from '../data/videos'

// =============================================================================
// TYPES
// =============================================================================

interface CarouselGridProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  isDark?: boolean
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
const getNavButtonStyle = (isDark: boolean): React.CSSProperties => ({
  fontFamily: "'Jersey 15', sans-serif",
  fontSize: '42px',
  color: isDark ? '#ffffff' : '#000000',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  lineHeight: 1,
  padding: '8px',
  userSelect: 'none',
})

// =============================================================================
// COMPONENT
// =============================================================================

export function CarouselGrid({
  categories,
  activeCategory,
  onCategoryChange,
  isDark = false,
}: CarouselGridProps) {
  // Start at position 10 so center rectangle shows 10 (middle of 0-19)
  const [horizontalIndex, setHorizontalIndex] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const activeIndex = categories.indexOf(activeCategory)
  const gridRef = useRef<HTMLDivElement | null>(null)

  // Get current video data for modal
  const currentVideoData = getVideoData(categories[activeIndex], horizontalIndex)
  const currentColor = CATEGORY_COLORS[categories[activeIndex]] ?? DEFAULT_COLOR

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
      // Don't handle wheel events if modal is open
      if (isModalOpen) return
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
  }, [isModalOpen, handlePrevCategory, handleNextCategory, handlePrevVideo, handleNextVideo])

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

  /** Returns YouTube video ID based on row offset and column position */
  const getYouTubeId = (rowOffset: number, col: number): string | null => {
    const rowCategoryIndex = activeIndex + rowOffset
    if (rowCategoryIndex < 0 || rowCategoryIndex >= categories.length) return null
    
    const category = categories[rowCategoryIndex]
    const videoIndex = horizontalIndex + col
    
    // Check bounds for the 20 videos per category
    if (videoIndex < 0 || videoIndex >= 20) return null
    
    return getVideoId(category, videoIndex)
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
          const videoNum = getVideoNum(rowOffset, col)
          const youtubeId = getYouTubeId(rowOffset, col)
          
          // Check if centered box has video data for info button
          const videoData = isCentered 
            ? getVideoData(categories[activeIndex], horizontalIndex)
            : null
          const hasInfo = Boolean(videoData?.title || videoData?.description)
          
          return (
            <VideoBox
              key={`${rowOffset}-${col}`}
              videoId={youtubeId}
              borderColor={rowColor}
              displayNumber={videoNum}
              isCentered={isCentered}
              isSmall={isSmall}
              isExtraSmall={isExtraSmall}
              isDark={isDark}
              onClick={() => handleBoxClick(rowOffset, col)}
              onInfoClick={isCentered ? () => setIsModalOpen(true) : undefined}
              hasInfo={hasInfo}
            />
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
            style={getNavButtonStyle(isDark)}
            aria-label="Previous category"
          >
            ^
          </motion.button>

          {/* Vertical Slider Track */}
          <div
            className="flex flex-col items-center justify-center relative"
            style={{ height: '200px', width: '24px' }}
          >
              <div
                className="absolute w-[2px] h-full left-1/2 -translate-x-1/2 transition-colors duration-300"
                style={{ backgroundColor: isDark ? '#ffffff' : '#000000', opacity: 0.9 }}
              />
              <motion.div
                className="absolute rounded-full left-1/2 -translate-x-1/2 transition-colors duration-300"
                style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: isDark ? '#ffffff' : '#000000',
                    boxShadow: isDark ? '0 6px 18px rgba(0,0,0,0.6)' : '0 6px 18px rgba(0,0,0,0.35)',
                    border: isDark ? '3px solid rgba(0,0,0,0.6)' : '3px solid rgba(255,255,255,0.85)',
                    zIndex: 40
                  }}
                animate={{ top: `${(activeIndex / Math.max(1, categories.length - 1)) * 100}%` }}
                transition={{ type: 'spring', damping: 15, stiffness: 150 }}
              />
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextCategory}
            style={getNavButtonStyle(isDark)}
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
          style={getNavButtonStyle(isDark)}
          aria-label="Previous video"
        >
          {'<'}
        </motion.button>

        {/* Horizontal Slider Track */}
        <div className="flex items-center justify-center relative" style={{ width: '300px', height: '24px' }}>
            <div
              className="absolute w-full h-[2px] top-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{ backgroundColor: isDark ? '#ffffff' : '#000000', opacity: 0.9 }}
            />
            <motion.div
              className="absolute rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: isDark ? '#ffffff' : '#000000',
                boxShadow: isDark ? '0 6px 18px rgba(0,0,0,0.6)' : '0 6px 18px rgba(0,0,0,0.35)',
                border: isDark ? '3px solid rgba(0,0,0,0.6)' : '3px solid rgba(255,255,255,0.85)',
                zIndex: 40
              }}
              animate={{ left: `${(horizontalIndex / MAX_HORIZONTAL_INDEX) * 100}%` }}
              transition={{ type: 'spring', damping: 15, stiffness: 150 }}
            />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextVideo}
          style={getNavButtonStyle(isDark)}
          aria-label="Next video"
        >
          {'>'}
        </motion.button>
      </nav>

      {/* Video Info Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId={currentVideoData?.youtubeId ?? null}
        title={currentVideoData?.title ?? null}
        description={currentVideoData?.description ?? null}
        borderColor={currentColor}
      />
    </div>
  )
}
