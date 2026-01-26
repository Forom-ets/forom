import { motion } from 'framer-motion'
import contactIcon from '../assets/icons/contact.png'
import supportIcon from '../assets/icons/support.png'
import tokenIcon from '../assets/icons/tokens.png'
import cedilleIcon from '../assets/icons/cedille.png'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Color-coded letters for "FOROM" branding */
const LOGO_LETTERS = [
  { text: 'F', color: '#FF0000', darkColor: '#FF0000' },
  { text: 'O', color: '#000000', darkColor: '#ffffff' },
  { text: 'R', color: '#FFD700', darkColor: '#FFD700' },
  { text: 'O', color: '#000000', darkColor: '#ffffff' },
  { text: 'M', color: '#0066FF', darkColor: '#0066FF' },
]

/** Animation settings for staggered letter entrance */
const letterAnimation = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
}

// =============================================================================
// COMPONENT
// =============================================================================

interface HeaderProps {
  onTokenClick: () => void
  onSupportClick: () => void
  isDark?: boolean
}

export function Header({ onTokenClick, onSupportClick, isDark = false }: HeaderProps) {
  // Icon sizing and style tuned to match centered circular badges
  const iconContainerStyle = { width: '44px', height: '44px' }
  const iconStyle = `rounded-full border-[3px] p-1 cursor-pointer flex items-center justify-center overflow-hidden transition-colors duration-300`
  const iconColors = {
    backgroundColor: isDark ? '#18181b' : '#ffffff',
    borderColor: isDark ? '#52525b' : '#000000',
  }
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-4 pb-4 px-16 relative z-50 flex flex-col items-center gap-6 transition-colors duration-300"
      style={{ paddingTop: '2vh', backgroundColor: 'var(--color-bg)' }}
    >
      <div className="relative flex items-center justify-center gap-4">
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
            className="transition-colors duration-300"
            style={{
              fontSize: '56px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 900,
              color: isDark ? letter.darkColor : letter.color,
              lineHeight: 1,
              letterSpacing: '0.05em',
            }}
          >
            {letter.text}
          </motion.span>
        ))}
        {/* Tiny cedille easter-egg dot (very small, links to Cedille) */}
        <a
          href="https://cedille.etsmtl.ca/"
          target="_blank"
          rel="noopener noreferrer"
          title="Cedille"
          style={{
            position: 'absolute',
            right: '-22px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '18px',
            height: '18px',
            display: 'block',
            borderRadius: '9999px',
            overflow: 'visible',
            cursor: 'pointer'
          }}
        >
          <img src={cedilleIcon} alt="Cedille" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        </a>
      </div>

      <div className="flex items-center justify-between mt-32" style={{ width: '240px', marginTop: '4vh' }}>
        {/* Support Icon - Left */}
        <motion.div 
          className={iconStyle}
          style={{ ...iconContainerStyle, ...iconColors }}
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSupportClick}
          title="Support Information"
        >
          <img src={supportIcon} alt="Support" className="w-3/4 h-3/4 object-contain" />
        </motion.div>

        {/* Token Icon - Center */}
        <motion.div 
          className={iconStyle}
          style={{ ...iconContainerStyle, ...iconColors }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTokenClick}
          title="Token Information"
        >
          <img src={tokenIcon} alt="Tokens" className="w-3/4 h-3/4 object-contain" />
        </motion.div>

        {/* Contact Icon - Right */}
        <motion.a 
          href="https://discord.gg/MdeNvRs5R9"
          target="_blank"
          rel="noopener noreferrer"
          className={iconStyle}
          style={{ ...iconContainerStyle, ...iconColors }}
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          title="Contact Us"
        >
            <img
              src={contactIcon}
              alt="Contact"
              className="w-3/4 h-3/4 object-contain"
              style={{ filter: isDark ? 'invert(1)' : 'none' }}
            />
        </motion.a>
      </div>
    </motion.header>
  )
}
