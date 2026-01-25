import { motion } from 'framer-motion'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Color-coded letters for "FOROM" branding */
const LOGO_LETTERS = [
  { text: 'F', color: '#FF0000' },
  { text: 'O', color: '#000000' },
  { text: 'R', color: '#FFD700' },
  { text: 'O', color: '#000000' },
  { text: 'M', color: '#0066FF' },
]

/** Animation settings for staggered letter entrance */
const letterAnimation = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white py-6 px-16"
      style={{ paddingTop: '5vh' }}
    >
      <div className="flex items-center justify-center gap-4">
        {LOGO_LETTERS.map((letter, index) => (
          <motion.span
            key={index}
            initial={letterAnimation.initial}
            animate={letterAnimation.animate}
            transition={{
              delay: index * 0.1,
              type: 'spring',
              damping: 12,
              stiffness: 100,
            }}
            style={{
              fontSize: '64px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 900,
              color: letter.color,
              lineHeight: 1,
              letterSpacing: '0.05em',
            }}
          >
            {letter.text}
          </motion.span>
        ))}
      </div>
    </motion.header>
  )
}
