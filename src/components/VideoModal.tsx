import Modal from 'react-modal'
import { X, Play } from 'lucide-react'

// Set the app element for accessibility (prevents background scrolling/interaction)
Modal.setAppElement('#root')

// =============================================================================
// TYPES
// =============================================================================

export interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoId: string | null
  title: string | null
  description: string | null
  borderColor?: string
}

// =============================================================================
// STYLES
// =============================================================================

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const getContentStyles = (borderColor: string): React.CSSProperties => ({
  position: 'relative',
  width: '90vw',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflow: 'auto',
  borderRadius: '12px',
  border: `4px solid ${borderColor}`,
  backgroundColor: 'var(--color-surface, #ffffff)',
  color: 'var(--color-text, #000000)',
  padding: 0,
  inset: 'auto', // Override default positioning
})

// =============================================================================
// COMPONENT
// =============================================================================

export function VideoModal({
  isOpen,
  onClose,
  videoId,
  title,
  description,
  borderColor = '#E5E7EB',
}: VideoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title || 'Video Modal'}
      style={{
        overlay: overlayStyles,
        content: getContentStyles(borderColor),
      }}
      closeTimeoutMS={200}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
        aria-label="Close modal"
        type="button"
      >
        <X size={24} />
      </button>

      {/* Video Section */}
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`}
            title={title || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800">
            <Play size={48} className="text-zinc-400" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold text-black dark:text-white mb-3">
            {title}
          </h2>
        )}

        {/* Description */}
        {description && (
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {description}
          </p>
        )}

        {/* Fallback if no content */}
        {!title && !description && (
          <p className="text-zinc-500 dark:text-zinc-400 italic">
            No additional information available.
          </p>
        )}
      </div>
    </Modal>
  )
}
