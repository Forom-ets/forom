import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Memory } from '../data/memories'
import tokensIcon from '../assets/icons/tokens.svg'

export interface EmptyQuestModalProps {
  isOpen: boolean
  onClose: () => void
  memory: Memory | null
  categoryLabel?: string
  tagLabel?: string
  onTokenClick?: () => void
}

export function EmptyQuestModal({
  isOpen,
  onClose,
  memory,
  categoryLabel,
  tagLabel,
  onTokenClick,
}: EmptyQuestModalProps) {

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !memory) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[15] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Main Container - Centered */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative flex flex-col items-center justify-center text-center bg-[#D9D9D9] w-[85vw] h-[70vh] max-w-[1200px] border-[10px] md:border-[16px] border-black rounded-[40px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ boxSizing: 'border-box' }}
          >
            {/* Close Button top-right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-black hover:bg-gray-800 text-white rounded-full w-[36px] h-[36px] md:w-[48px] md:h-[48px] transition-colors z-50 flex items-center justify-center cursor-pointer shadow-lg outline-none"
            >
              <X size={20} strokeWidth={3} className="md:w-[24px] md:h-[24px]" />
            </button>

            {/* TOP INFOS */}
            <div className="absolute top-[10%] left-0 w-full flex flex-col items-center justify-center gap-1 uppercase font-bold text-[#111111]" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px, 1.2vw, 14px)' }}>
              <div>[ CATEGORY: {categoryLabel || memory.category} ]</div>
              <div>[ TAG: {tagLabel || memory.question} ]</div>
            </div>

            {/* CENTER TEXT */}
            <div className="flex-1 flex items-center justify-center">
              <h2 
                className="text-black uppercase tracking-widest drop-shadow-sm font-bold m-0 leading-none"
                style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: 'clamp(40px, 9vw, 100px)' }}
              >
                AUCUNE QUÊTE
              </h2>
            </div>

            {/* BOTTOM INFOS */}
            <div className="absolute bottom-[10%] left-0 w-full flex flex-col items-center justify-center gap-3">
              <span className="text-black font-semibold text-center tracking-normal" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px, 1vw, 12px)' }}>
                Allez dans le terminal<br />to
                <span className="flex justify-center w-full mt-2">
                  <VChevron />
                </span>
              </span>
              <button 
                onClick={onTokenClick}
                className="hover:scale-110 transition-transform cursor-pointer bg-transparent border-none p-0 outline-none mt-2"
              >
                <img 
                  src={tokensIcon} 
                  alt="Token" 
                  className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] object-contain drop-shadow-md"
                />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function VChevron() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 2L8 8L13.5 2" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
