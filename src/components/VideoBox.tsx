import { motion } from 'framer-motion'

// =============================================================================
// TYPES
// =============================================================================

export interface VideoBoxProps {
  /** YouTube video ID (e.g., 'dQw4w9WgXcQ') - null hides the box */
  videoId: string | null
  /** Optional title for the video */
  title?: string
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
  title,
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
    ? { width: '17vw', height: '11.5vw', minWidth: '170px', minHeight: '115px' }
    : isExtraSmall
      ? { width: '4vw', height: '2.7vw', minWidth: '40px', minHeight: '27px' }
      : isSmall
        ? { width: '7.5vw', height: '5vw', minWidth: '75px', minHeight: '50px' }
        : { width: '10vw', height: '6.8vw', minWidth: '100px', minHeight: '68px' }

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
        className="relative overflow-hidden flex items-center justify-center transition-colors duration-300"
        onClick={onClick}
        whileHover={onClick ? { scale: 1.05 } : undefined}
        style={{
          border: `3px solid ${borderColor}`,
          backgroundColor: isDark ? '#27272a' : '#fce7f3',
          ...dimensions,
          cursor: onClick ? 'pointer' : 'default',
          borderRadius: '16px', // Force rounded corners via inline style
        }}
      >
        {showEmbed && renderYouTubeEmbed()}
        {showThumbnail && renderThumbnail()}
        {!hasVideo && renderPlaceholder()}
      </motion.div>
      
      {/* Info bar shown below the centered/selected container */}
      {showInfoButton && (
        <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 120 }}
            className="w-full flex justify-between items-center mt-2 cursor-pointer select-none"
            onClick={(e) => {
                e.stopPropagation()
                onInfoClick()
            }}
            style={{
                fontFamily: "'Jersey 15', sans-serif",
                color: isDark ? '#ffffff' : '#000000',
                fontSize: '24px'
            }}
        >
            <span>
                {displayNumber !== null && displayNumber !== undefined ? (displayNumber + 1).toString().padStart(2, '0') + '.' : ''}
            </span>
            <span className="truncate ml-2">
                {title || 'Sans titre'}
            </span>
        </motion.div>
      )}
    </div>
  )
}
