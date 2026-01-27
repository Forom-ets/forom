import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MemoryBox } from './MemoryBox'
import { MemoryModal } from './MemoryModal'
import { getMemory, ITEMS_PER_ROW } from '../data/memories'
import type { Memory, CategoryType } from '../data/memories'

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

/** Maximum horizontal scroll index (20 rectangles per row - 1 = 19) */
const MAX_HORIZONTAL_INDEX = ITEMS_PER_ROW - 1

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
  const horizontalTrackRef = useRef<HTMLDivElement | null>(null)
  const verticalTrackRef = useRef<HTMLDivElement | null>(null)
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false)
  const [isDraggingVertical, setIsDraggingVertical] = useState(false)

  // Get current memory data for modal
  const currentMemory = getMemory(categories[activeIndex] as CategoryType, horizontalIndex)
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
  // Navigation Handlers (memoized to prevent unnecessary re-renders)
  // ---------------------------------------------------------------------------

  const handlePrevCategory = useCallback(() => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : categories.length - 1
    onCategoryChange(categories[newIndex])
  }, [activeIndex, categories, onCategoryChange])

  const handleNextCategory = useCallback(() => {
    const newIndex = activeIndex < categories.length - 1 ? activeIndex + 1 : 0
    onCategoryChange(categories[newIndex])
  }, [activeIndex, categories, onCategoryChange])

  const handlePrevVideo = useCallback(() => {
    setHorizontalIndex(prev => prev > 0 ? prev - 1 : MAX_HORIZONTAL_INDEX)
  }, [])

  const handleNextVideo = useCallback(() => {
    setHorizontalIndex(prev => prev < MAX_HORIZONTAL_INDEX ? prev + 1 : 0)
  }, [])

  // ---------------------------------------------------------------------------
  // Drag Handlers for Sliders
  // ---------------------------------------------------------------------------

  // Horizontal slider drag
  const handleHorizontalDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingHorizontal(true)
  }, [])

  const handleHorizontalDrag = useCallback((e: MouseEvent) => {
    if (!isDraggingHorizontal || !horizontalTrackRef.current) return
    
    const track = horizontalTrackRef.current
    const rect = track.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const newIndex = Math.round(percentage * MAX_HORIZONTAL_INDEX)
    setHorizontalIndex(newIndex)
  }, [isDraggingHorizontal])

  const handleHorizontalDragEnd = useCallback(() => {
    setIsDraggingHorizontal(false)
  }, [])

  // Vertical slider drag
  const handleVerticalDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingVertical(true)
  }, [])

  const handleVerticalDrag = useCallback((e: MouseEvent) => {
    if (!isDraggingVertical || !verticalTrackRef.current) return
    
    const track = verticalTrackRef.current
    const rect = track.getBoundingClientRect()
    const y = e.clientY - rect.top
    const percentage = Math.max(0, Math.min(1, y / rect.height))
    const newIndex = Math.round(percentage * (categories.length - 1))
    if (newIndex >= 0 && newIndex < categories.length) {
      onCategoryChange(categories[newIndex])
    }
  }, [isDraggingVertical, categories, onCategoryChange])

  const handleVerticalDragEnd = useCallback(() => {
    setIsDraggingVertical(false)
  }, [])

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDraggingHorizontal) {
      window.addEventListener('mousemove', handleHorizontalDrag)
      window.addEventListener('mouseup', handleHorizontalDragEnd)
      return () => {
        window.removeEventListener('mousemove', handleHorizontalDrag)
        window.removeEventListener('mouseup', handleHorizontalDragEnd)
      }
    }
  }, [isDraggingHorizontal, handleHorizontalDrag, handleHorizontalDragEnd])

  useEffect(() => {
    if (isDraggingVertical) {
      window.addEventListener('mousemove', handleVerticalDrag)
      window.addEventListener('mouseup', handleVerticalDragEnd)
      return () => {
        window.removeEventListener('mousemove', handleVerticalDrag)
        window.removeEventListener('mouseup', handleVerticalDragEnd)
      }
    }
  }, [isDraggingVertical, handleVerticalDrag, handleVerticalDragEnd])

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

  /** Returns global video number based on row offset and column position (0-99 total, 20 per row) */
  const getGlobalIndex = (rowOffset: number, col: number): number | null => {
    // Calculate the actual category index for this row
    const rowCategoryIndex = activeIndex + rowOffset
    // If out of bounds, return null (row should be hidden)
    if (rowCategoryIndex < 0 || rowCategoryIndex >= categories.length) return null
    // Each category has 20 numbers: category 0 = 0-19, category 1 = 20-39, etc.
    const baseNumber = rowCategoryIndex * ITEMS_PER_ROW
    const itemIndex = horizontalIndex + col
    
    // Check if item index is within valid range for this category
    if (itemIndex < 0 || itemIndex >= ITEMS_PER_ROW) return null
    
    return baseNumber + itemIndex
  }

  /** Returns Memory data based on row offset and column position */
  const getMemoryForPosition = (rowOffset: number, col: number): Memory | null => {
    const rowCategoryIndex = activeIndex + rowOffset
    if (rowCategoryIndex < 0 || rowCategoryIndex >= categories.length) return null
    
    const category = categories[rowCategoryIndex] as CategoryType
    const itemIndex = horizontalIndex + col
    
    // Check bounds for the items per category
    if (itemIndex < 0 || itemIndex >= ITEMS_PER_ROW) return null
    
    return getMemory(category, itemIndex)
  }

  // ---------------------------------------------------------------------------
  // Grid Render Logic
  // ---------------------------------------------------------------------------

  const renderRow = (rowOffset: number, opacity: number, gap: string = '2vw') => {
    const rowColor = getRowColor(rowOffset)
    
    return (
      <div 
        key={rowOffset}
        className="flex items-center justify-center transition-opacity duration-200"
        style={{ gap, opacity }}
      >
        {[-2, -1, 0, 1, 2].map((col) => {
          // Center box of the middle row gets special treatment
          const isCentered = rowOffset === 0 && col === 0
          const globalIndex = getGlobalIndex(rowOffset, col)
          const memory = getMemoryForPosition(rowOffset, col)

          // Calculate sizing based on positions to create sphere perspective
          const absRow = Math.abs(rowOffset)
          const absCol = Math.abs(col)

          // Make outer columns smaller to enhance depth effect
          const isExtraSmall = absRow === 2 || (absRow === 1 && absCol === 2)
          const isSmall = absRow === 1 || (absRow === 0 && absCol === 2)
          
          return (
            <MemoryBox
              key={`${rowOffset}-${col}`}
              memory={memory}
              borderColor={rowColor}
              displayNumber={globalIndex}
              isCentered={isCentered}
              isSmall={isSmall}
              isExtraSmall={isExtraSmall}
              isDark={isDark}
              onClick={() => handleBoxClick(rowOffset, col)}
              onInfoClick={isCentered ? () => setIsModalOpen(true) : undefined}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      style={{ paddingLeft: '19vw', paddingRight: '22vw', paddingTop: '2vh', paddingBottom: '22vh' }}
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
            ref={verticalTrackRef}
            className="flex flex-col items-center justify-center relative"
            style={{ height: '200px', width: '24px', cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const y = e.clientY - rect.top
              const percentage = Math.max(0, Math.min(1, y / rect.height))
              const newIndex = Math.round(percentage * (categories.length - 1))
              if (newIndex >= 0 && newIndex < categories.length) {
                onCategoryChange(categories[newIndex])
              }
            }}
          >
              <div
                className="absolute w-[2px] h-full left-1/2 -translate-x-1/2 transition-colors duration-300"
                style={{ backgroundColor: isDark ? '#ffffff' : '#000000', opacity: 0.9 }}
              />
              <div
                className="absolute rounded-full left-1/2 -translate-x-1/2"
                style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: isDark ? '#ffffff' : '#000000',
                    boxShadow: isDark ? '0 6px 18px rgba(0,0,0,0.6)' : '0 6px 18px rgba(0,0,0,0.35)',
                    border: isDark ? '3px solid rgba(0,0,0,0.6)' : '3px solid rgba(255,255,255,0.85)',
                    zIndex: 40,
                    top: `${(activeIndex / Math.max(1, categories.length - 1)) * 100}%`,
                    cursor: 'grab',
                    transition: isDraggingVertical ? 'none' : 'top 0.3s ease-out'
                  }}
                onMouseDown={handleVerticalDragStart}
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
        <div 
          ref={horizontalTrackRef}
          className="flex items-center justify-center relative" 
          style={{ width: '300px', height: '24px', cursor: 'pointer' }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const percentage = Math.max(0, Math.min(1, x / rect.width))
            const newIndex = Math.round(percentage * MAX_HORIZONTAL_INDEX)
            setHorizontalIndex(newIndex)
          }}
        >
            <div
              className="absolute w-full h-[2px] top-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{ backgroundColor: isDark ? '#ffffff' : '#000000', opacity: 0.9 }}
            />
            <div
              className="absolute rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: isDark ? '#ffffff' : '#000000',
                boxShadow: isDark ? '0 6px 18px rgba(0,0,0,0.6)' : '0 6px 18px rgba(0,0,0,0.35)',
                border: isDark ? '3px solid rgba(0,0,0,0.6)' : '3px solid rgba(255,255,255,0.85)',
                zIndex: 40,
                left: `${(horizontalIndex / MAX_HORIZONTAL_INDEX) * 100}%`,
                cursor: 'grab',
                transition: isDraggingHorizontal ? 'none' : 'left 0.3s ease-out'
              }}
              onMouseDown={handleHorizontalDragStart}
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

      {/* Memory Info Modal */}
      <MemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memory={currentMemory}
        borderColor={currentColor}
        index={activeIndex * ITEMS_PER_ROW + horizontalIndex}
      />
    </div>
  )
}
