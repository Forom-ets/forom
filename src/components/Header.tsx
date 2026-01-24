import { motion } from 'framer-motion'

// Color-coded letters for "FOROM" branding
const LOGO_LETTERS = [
  { text: 'F', color: '#FF0000' },
  { text: 'O', color: '#000000' },
  { text: 'R', color: '#FFD700' },
  { text: 'O', color: '#000000' },
  { text: 'M', color: '#0066FF' },
]

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 py-8 px-16"
    >
      <div className="flex items-center justify-center gap-0">
        {LOGO_LETTERS.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.1,
              type: 'spring' as const,
              damping: 12,
              stiffness: 100,
            }}
            style={{ 
              fontSize: '120px',
              fontFamily: 'Montserrat, sans-serif', 
              fontWeight: 900, 
              fontStyle: 'normal',
              color: letter.color,
              lineHeight: '1',
              letterSpacing: '0.1em',
            }}
          >
            {letter.text}
          </motion.span>
        ))}
      </div>
    </motion.header>
  )
}
