import { useEffect } from 'react'
import Modal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { extractYouTubeId, hasVideo } from '../data/memories'
import type { Memory } from '../data/memories'

// =============================================================================
// TYPES
// =============================================================================

export interface MemoryModalProps {
  isOpen: boolean
  onClose: () => void
  memory: Memory | null
  borderColor?: string
  index?: number
}

// =============================================================================
// MODAL STYLES
// =============================================================================

const customStyles: Modal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    width: '75vw',
    height: '75vh',
    padding: 0,
    border: 'none',
    background: 'transparent',
    overflow: 'visible',
    borderRadius: 0,
  },
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50,
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 300,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 30,
    transition: {
      duration: 0.2,
    },
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MemoryModal({
  isOpen,
  onClose,
  memory,
  borderColor = '#E5E7EB',
  index: _index,
}: MemoryModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!memory) return null

  const videoId = extractYouTubeId(memory.videoUrl)
  const memoryHasVideo = hasVideo(memory)

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={customStyles}
          closeTimeoutMS={200}
          contentLabel={memory.title}
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
          ariaHideApp={true}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full h-full flex flex-col"
            style={{
              backgroundColor: '#D9D9D9',
              border: `6px solid ${borderColor}`,
              borderRadius: '16px',
              boxShadow: '0 0 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Close Button - Absolute Top Right */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-[#FF3B30] rounded-full flex items-center justify-center shadow-lg z-50 cursor-pointer"
              aria-label="Close modal"
              type="button"
            >
              <X size={24} strokeWidth={3} className="text-white" />
            </motion.button>

            <div className="flex-1 flex flex-col p-12">
              
              {/* Top: Title */}
              <div className="flex justify-center mb-10 header-section">
                  <h2 
                      className="text-6xl text-black uppercase tracking-wide text-center"
                      style={{ fontFamily: "'Jersey 15', sans-serif" }}
                  >
                      {memory.title}
                  </h2>
              </div>

              {/* Middle: Memory label and Content */}
              <div className="flex-1 flex flex-col min-h-0 text-left relative">
                  <span 
                      className="text-4xl text-white mb-4 block"
                      style={{ 
                          fontFamily: "'Jersey 15', sans-serif",
                          textShadow: '0px 2px 4px rgba(0,0,0,0.2)'
                      }}
                  >
                      Mémoire:
                  </span>
                  <div className="flex-1 overflow-y-auto pr-4">
                      <p 
                        className="text-xl text-gray-800 leading-relaxed font-medium"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                          {memory.description}
                      </p>
                  </div>
              </div>

              {/* Bottom: Youtube Link */}
              <div className="mt-8 flex flex-col items-center justify-end">
                  <span 
                      className="text-3xl text-black mb-4 uppercase"
                      style={{ fontFamily: "'Jersey 15', sans-serif" }}
                  >
                      Youtube link:
                  </span>
                  
                  {/* Divider Line / Link Area */}
                  {memoryHasVideo && videoId ? (
                      <div className="w-full max-w-2xl relative group">
                           <div className="relative w-full aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-md border-2 border-black/10">
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                title={memory.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                                style={{ border: 'none' }}
                              />
                           </div>
                      </div>
                  ) : (
                      <div className="w-64 h-0.5 bg-gray-400 opacity-50 rounded-full mt-2"></div>
                  )}
              </div>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  )
}
