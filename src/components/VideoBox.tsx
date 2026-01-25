import { motion } from 'framer-motion'

// =============================================================================
// TYPES
// =============================================================================

export interface VideoBoxProps {
  /** YouTube video ID (e.g., 'dQw4w9WgXcQ') - null hides the box */
  videoId: string | null
  /** Border color for the box */
  borderColor: string
  /** Display number shown when no video is available */
  displayNumber?: number | null
  /** Whether this is the center (active) box */
  isCentered?: boolean
  /** Small sizing for adjacent rows */
  isSmall?: boolean
  /** Extra small sizing for outer rows */
  isExtraSmall?: boolean
  /** Dark mode styling */
  isDark?: boolean
  /** Click handler for navigation */
  onClick?: () => void
  /** Click handler for info button (opens modal) - only shown when centered */
  onInfoClick?: () => void
  /** Whether video has additional info to show */
  hasInfo?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export function VideoBox({
  videoId,
  borderColor,
  displayNumber,
  isCentered = false,
  isSmall = false,
  isExtraSmall = false,
  isDark = false,
  onClick,
  onInfoClick,
  hasInfo = false,
}: VideoBoxProps) {
  // ---------------------------------------------------------------------------
  // Dimension Calculations
  // ---------------------------------------------------------------------------

  const dimensions = isCentered
    ? { width: '14vw', height: '9.5vw', minWidth: '140px', minHeight: '95px' }
    : isExtraSmall
      ? { width: '3vw', height: '2vw', minWidth: '30px', minHeight: '20px' }
      : isSmall
        ? { width: '6vw', height: '4vw', minWidth: '60px', minHeight: '40px' }
        : { width: '8vw', height: '5.5vw', minWidth: '80px', minHeight: '55px' }

  // Hide box if no video AND no display number
  if (videoId === null && displayNumber === null) {
    return <div style={{ ...dimensions, visibility: 'hidden' }} />
  }

  // ---------------------------------------------------------------------------
  // Font Size Calculations
  // ---------------------------------------------------------------------------

  const fontSize = isCentered
    ? 'clamp(24px, 2.5vw, 48px)'
    : isExtraSmall
      ? 'clamp(8px, 1vw, 14px)'
      : isSmall
        ? 'clamp(14px, 1.5vw, 24px)'
        : 'clamp(16px, 1.8vw, 28px)'

  // ---------------------------------------------------------------------------
  // Render Content
  // ---------------------------------------------------------------------------

  /** Render YouTube embed for the centered/active box */
  const renderYouTubeEmbed = () => (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
      title="YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 w-full h-full"
      style={{ border: 'none' }}
    />
  )

  /** Render YouTube thumbnail for non-centered boxes */
  const renderThumbnail = () => (
    <img
      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
      alt="Video thumbnail"
      className="w-full h-full object-cover"
      loading="lazy"
    />
  )

  /** Render placeholder number when no video is available */
  const renderPlaceholder = () => (
    <span
      className="font-bold transition-colors duration-300"
      style={{ fontSize, color: isDark ? '#a1a1aa' : '#4b5563' }}
    >
      {displayNumber}
    </span>
  )

  // Determine what content to show
  const hasVideo = videoId !== null
  const showEmbed = hasVideo && isCentered
  const showThumbnail = hasVideo && !isCentered
  const showInfoButton = isCentered && hasInfo && onInfoClick

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className="relative rounded-sm overflow-hidden flex items-center justify-center transition-colors duration-300"
        onClick={onClick}
        whileHover={onClick ? { scale: 1.05 } : undefined}
        style={{
          border: `3px solid ${borderColor}`,
          backgroundColor: isDark ? '#27272a' : '#fce7f3',
          ...dimensions,
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        {showEmbed && renderYouTubeEmbed()}
        {showThumbnail && renderThumbnail()}
        {!hasVideo && renderPlaceholder()}
      </motion.div>
      
      {/* Info button shown below the centered/selected container */}
      {showInfoButton && (
        <motion.button
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 120 }}
          onClick={(e) => {
            e.stopPropagation()
            onInfoClick()
          }}
          className="mt-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: borderColor,
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          More Info
        </motion.button>
      )}
    </div>
  )
}
