import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play } from 'lucide-react'
import { extractYouTubeId, hasVideo, WH_QUESTIONS, updateMemory } from '../data/memories'
import type { Memory, WhQuestion, CategoryType } from '../data/memories'

// =============================================================================
// TYPES
// =============================================================================

export interface MemoryModalProps {
  isOpen: boolean
  onClose: () => void
  memory: Memory | null
  borderColor?: string
  index?: number
  onMemoryUpdate?: (memory: Memory) => void
}

interface FormData {
  question: WhQuestion | null
  title: string
  videoUrl: string
  description: string
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
  onMemoryUpdate,
}: MemoryModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    question: null,
    title: '',
    videoUrl: '',
    description: '',
  })

  // Reset form when memory changes or modal opens
  useEffect(() => {
    if (memory) {
      setFormData({
        question: memory.question,
        title: memory.isFilled ? memory.title : '',
        videoUrl: memory.videoUrl || '',
        description: memory.isFilled ? memory.description : '',
      })
      // Auto-open edit mode for empty memories
      setIsEditing(!memory.isFilled)
    }
  }, [memory, isOpen])

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
  const formVideoId = extractYouTubeId(formData.videoUrl)

  // Handle form submission
  const handleSave = () => {
    if (!formData.question || !formData.title.trim()) {
      return // Don't save if required fields are empty
    }

    const updatedMemory = updateMemory(memory.category as CategoryType, 
      parseInt(memory.id.split('-')[1]), {
        question: formData.question,
        title: formData.title.trim(),
        description: formData.description.trim(),
        videoUrl: formData.videoUrl.trim() || null,
        isFilled: true,
      }
    )

    if (updatedMemory && onMemoryUpdate) {
      onMemoryUpdate(updatedMemory)
    }

    setIsEditing(false)
  }

  // Render the filled memory view (display mode)
  const renderFilledView = () => (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-xl">
      {/* Background - Video Thumbnail or Embed */}
      <div className="absolute inset-0 z-0">
        {memoryHasVideo && videoId ? (
          <>
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
          </>
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: '#2a2a2e' }}
          />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex-1 flex flex-col p-8">
        {/* Top: YouTube Link */}
        <div className="text-center mb-6">
          <span 
            className="text-2xl text-white uppercase tracking-wide"
            style={{ fontFamily: "'Jersey 15', sans-serif" }}
          >
            Youtube link:
          </span>
          {memory.videoUrl && (
            <a 
              href={memory.videoUrl.startsWith('http') ? memory.videoUrl : `https://www.youtube.com/watch?v=${memory.videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-white/80 hover:text-white underline mt-1 truncate"
            >
              {memory.videoUrl.startsWith('http') ? memory.videoUrl : `https://www.youtube.com/watch?v=${memory.videoUrl}`}
            </a>
          )}
        </div>

        {/* Center: Play Button */}
        {memoryHasVideo && (
          <div className="flex-1 flex items-center justify-center">
            <a
              href={memory.videoUrl?.startsWith('http') ? memory.videoUrl : `https://www.youtube.com/watch?v=${memory.videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Play size={40} className="text-black ml-1" fill="currentColor" />
            </a>
          </div>
        )}

        {/* Bottom: Question & Response */}
        <div className="mt-auto">
          {/* Question and Response Row */}
          <div className="flex justify-between items-end mb-4">
            {/* Left: Question */}
            <div>
              <span 
                className="text-sm uppercase tracking-widest text-white/70"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                QUESTION
              </span>
              <h2 
                className="text-4xl text-white mt-1"
                style={{ fontFamily: "'Jersey 15', sans-serif" }}
              >
                {memory.question || 'Question ?'}
              </h2>
            </div>

            {/* Right: Response */}
            <div className="text-right">
              <span 
                className="text-sm uppercase tracking-widest text-white/70"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                RÉPONSE
              </span>
              <h2 
                className="text-4xl text-white mt-1"
                style={{ fontFamily: "'Jersey 15', sans-serif" }}
              >
                {memory.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="text-left">
            <span 
              className="text-xs uppercase tracking-widest text-white/60 block mb-2"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              L'art de communiquer à l'ère numérique
            </span>
            <p 
              className="text-xs text-white/80 leading-relaxed line-clamp-3"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {memory.description}
            </p>
          </div>

          {/* Category Tag */}
          <div 
            className="mt-4 inline-block px-3 py-1 rounded text-sm"
            style={{ 
              backgroundColor: borderColor + '40',
              color: borderColor,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {memory.category}
          </div>
        </div>
      </div>
    </div>
  )

  // Render the edit/create form
  const renderEditView = () => (
    <div className="w-full h-full flex flex-col p-8 overflow-y-auto">
      <h2 
        className="text-3xl text-black mb-6 text-center"
        style={{ fontFamily: "'Jersey 15', sans-serif" }}
      >
        {memory.isFilled ? 'Modifier la mémoire' : 'Créer une nouvelle mémoire'}
      </h2>

      {/* Question Selection */}
      <div className="mb-6">
        <label 
          className="block text-lg font-semibold text-gray-700 mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Question *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {WH_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, question: q }))}
              className={`px-4 py-3 rounded-lg border-2 transition-all cursor-pointer ${
                formData.question === q 
                  ? 'border-current bg-opacity-20' 
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ 
                borderColor: formData.question === q ? borderColor : undefined,
                backgroundColor: formData.question === q ? borderColor + '20' : 'white',
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: '20px',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Title (Response) */}
      <div className="mb-6">
        <label 
          className="block text-lg font-semibold text-gray-700 mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Titre / Réponse *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Ex: Faire un club"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-current focus:outline-none transition-colors"
          style={{ 
            fontFamily: "'Montserrat', sans-serif",
            borderColor: formData.title ? borderColor : undefined,
          }}
        />
      </div>

      {/* YouTube URL */}
      <div className="mb-6">
        <label 
          className="block text-lg font-semibold text-gray-700 mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Lien YouTube
        </label>
        <input
          type="text"
          value={formData.videoUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-current focus:outline-none transition-colors"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        />
        {/* Video Preview */}
        {formVideoId && (
          <div className="mt-3 relative w-full aspect-video rounded-lg overflow-hidden border-2" style={{ borderColor }}>
            <img
              src={`https://img.youtube.com/vi/${formVideoId}/mqdefault.jpg`}
              alt="Aperçu vidéo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play size={48} className="text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6 flex-1">
        <label 
          className="block text-lg font-semibold text-gray-700 mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Description (max 400 mots)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => {
            const words = e.target.value.split(/\s+/).filter(Boolean)
            if (words.length <= 400) {
              setFormData(prev => ({ ...prev, description: e.target.value }))
            }
          }}
          placeholder="Ajoutez des informations sur votre tutoriel..."
          rows={6}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-current focus:outline-none transition-colors resize-none"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {formData.description.split(/\s+/).filter(Boolean).length} / 400 mots
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end mt-auto">
        <button
          type="button"
          onClick={() => {
            if (memory.isFilled) {
              setIsEditing(false)
            } else {
              onClose()
            }
          }}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!formData.question || !formData.title.trim()}
          className="px-6 py-3 rounded-lg text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: borderColor,
            fontFamily: "'Montserrat', sans-serif", 
            fontWeight: 600,
          }}
        >
          Sauvegarder
        </button>
      </div>
    </div>
  )

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
            className="w-full h-full"
            style={{
              backgroundColor: isEditing ? '#D9D9D9' : 'transparent',
              border: `6px solid ${borderColor}`,
              borderRadius: '16px',
              boxShadow: '0 0 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-[#FF3B30] rounded-full flex items-center justify-center shadow-lg z-50 cursor-pointer"
              aria-label="Close modal"
              type="button"
            >
              <X size={24} strokeWidth={3} className="text-white" />
            </motion.button>

            {/* Edit Button - Only show for filled memories in view mode */}
            {memory.isFilled && !isEditing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-16 px-4 py-2 bg-white/90 hover:bg-white rounded-full shadow-lg z-50 cursor-pointer text-sm font-semibold"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                type="button"
              >
                Modifier
              </motion.button>
            )}

            {isEditing ? renderEditView() : (memory.isFilled ? renderFilledView() : renderEditView())}
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  )
}
