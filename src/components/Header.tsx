import { motion } from 'framer-motion'
import contactIcon from '../assets/icons/contact.png'
import supportIcon from '../assets/icons/support.png'
import tokenIcon from '../assets/icons/tokens.png'

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

interface HeaderProps {
  onTokenClick: () => void
  onSupportClick: () => void
}

export function Header({ onTokenClick, onSupportClick }: HeaderProps) {
  // Icon sizing and style tuned to match centered circular badges
  // Increased default size so icons are larger before hover
  const iconContainerStyle = { width: '44px', height: '44px' }
  const iconStyle = "rounded-full border-[3px] border-black p-1 cursor-pointer bg-white flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors"
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Increased z-index to 50 to ensure header stays above other elements
      className="bg-white pt-4 pb-4 px-16 relative z-50 flex flex-col items-center gap-6"
      style={{ paddingTop: '2vh' }}
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
              fontSize: '56px',
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

      <div className="flex items-center justify-between mt-32" style={{ width: '240px', marginTop: '4vh' }}>
        {/* Support Icon - Left */}
        <motion.div 
          className={iconStyle}
          style={iconContainerStyle}
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
          style={iconContainerStyle}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTokenClick}
          title="Token Information"
        >
          <img src={tokenIcon} alt="Tokens" className="w-3/4 h-3/4 object-contain" />
        </motion.div>

        {/* Contact Icon - Right */}
        <motion.a 
          href="mailto:xaviermartelprod@gmail.com"
          className={iconStyle}
          style={iconContainerStyle}
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          title="Contact Us"
        >
          <img src={contactIcon} alt="Contact" className="w-3/4 h-3/4 object-contain" />
        </motion.a>
      </div>
    </motion.header>
  )
}
