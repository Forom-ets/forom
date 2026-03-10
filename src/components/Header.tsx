import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Ghost, Lock } from 'lucide-react'
import cedilleIcon from '../assets/icons/cedille.png'
import etsIcon from '../assets/icons/ets.jpg'
import githubIcon from '../assets/icons/github.png'
import chromaNotesIcon from '../assets/icons/chroma_notes.svg'
import userIcon from '../assets/icons/user.png'

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

/** Inline SVG for the colored Romap Logo */
function RomapLogo({ size = 36 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      <circle cx="18" cy="50" r="18" fill="#000000" />
      <circle cx="82" cy="50" r="18" fill="#000000" />
      <ellipse cx="50" cy="50" rx="36" ry="42" fill="#000000" />

      <circle cx="18" cy="50" r="8" fill="#FF0000" />
      <circle cx="82" cy="50" r="8" fill="#0066FF" />
      <ellipse cx="50" cy="50" rx="26" ry="32" fill="#FFCC00" />
    </svg>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

interface HeaderProps {
  onTokenClick: () => void
  onSupportClick: () => void
  onUserClick: () => void
  onLobbyClick?: () => void
  isDark?: boolean
  mission?: string
  isPhantom?: boolean
}

export function Header({ onTokenClick, onSupportClick, onUserClick, onLobbyClick, isDark = false, mission, isPhantom = false }: HeaderProps) {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchActive])

  const handleCloseSearch = () => {
    setIsSearchActive(false)
    setSearchQuery('')
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-[3%] relative z-50 flex items-center transition-colors duration-300"
      style={{ paddingTop: '2.2vh', paddingBottom: '1.6vh', backgroundColor: 'var(--color-bg)' }}
    >
      {/* ---- Left group: ETS, Search, FOROM ---- */}
      <div className="flex items-center" style={{ gap: '5%', flex: 1 }}>
        {/* Left Icons Group */}
        <div className="flex items-center shrink-0" style={{ gap: '2vw' }}>
          <motion.button
            onClick={onLobbyClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center shrink-0 cursor-pointer"
            style={{ width: '36px', height: '36px', background: 'none', border: 'none', padding: 0 }}
            title="Return to Lobby"
          >
            <img src={chromaNotesIcon} alt="Forom Lobby (Chroma Notes)" style={{ width: '36px', height: '36px', objectFit: 'contain', display: 'block' }} />
          </motion.button>

          <motion.button
            onClick={() => {}} // Placeholder for Romap
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center shrink-0 cursor-pointer"
            style={{ width: '36px', height: '36px', background: 'none', border: 'none', padding: 0 }}
            title="Romap"
          >
            <RomapLogo size={36} />
          </motion.button>

          <motion.a
            href="https://www.etsmtl.ca/experience-etudiante/clubs-etudiants"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center shrink-0 rounded-full overflow-hidden"
            style={{ width: '36px', height: '36px' }}
          >
            <img src={etsIcon} alt="ÉTS Montréal" className="w-full h-full object-cover" />
          </motion.a>

          <motion.a
            href="https://github.com/Forom-ets/forom"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center shrink-0 rounded-full overflow-hidden"
            style={{ width: '36px', height: '36px' }}
          >
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#0066FF',
                WebkitMaskImage: `url(${githubIcon})`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: `url(${githubIcon})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
              }} 
            />
          </motion.a>
        </div>

        {/* Search – circle expand animation */}
        <form
          className="forom-search-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={searchInputRef}
            type="text"
            className={`forom-search-input${isSearchActive ? ' forom-search-square' : ''}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && handleCloseSearch()}
            placeholder={isSearchActive ? 'Search FOROM...' : ''}
            readOnly={!isSearchActive}
            aria-label="Search"
          />
          <button
            type="button"
            className={`forom-search-btn${isSearchActive ? ' forom-search-close' : ''}`}
            onClick={() => {
              if (isSearchActive) {
                handleCloseSearch()
              } else {
                setIsSearchActive(true)
              }
            }}
            aria-label={isSearchActive ? 'Close search' : 'Open search'}
          />
        </form>
      </div>

      {/* ---- Center: FOROM Logo ---- */}
      <div className="flex flex-col items-center justify-center shrink-0 mx-[5%]">
        <div className="relative flex items-center justify-center gap-3">
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
              fontSize: '44px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 900,
              color: isDark ? letter.darkColor : letter.color,
              lineHeight: 1,
              letterSpacing: '0.04em',
            }}
          >
            {letter.text}
          </motion.span>
        ))}
        {/* Tiny cedille easter-egg dot */}
        <a
          href="https://cedille.etsmtl.ca/"
          target="_blank"
          rel="noopener noreferrer"
          title="Cedille"
          style={{
            position: 'absolute',
            right: '-18px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '14px',
            height: '14px',
            display: 'block',
            borderRadius: '9999px',
            overflow: 'visible',
            cursor: 'pointer',
          }}
        >
          <img
            src={cedilleIcon}
            alt="Cedille"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </a>
        </div>
        {/* Mission tagline */}
        {mission && (
          <div style={{
            marginTop: '4px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            maxWidth: '340px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center',
          }}>
            {mission}
          </div>
        )}
      </div>

      {/* ---- Right: Mail, Pixel Wallet ($), Help Hub (?), User ---- */}
      <div className="flex items-center justify-end" style={{ gap: '5%', flex: 1 }}>
        {/* Mail / Contact */}
        <motion.a
          href="https://discord.gg/MdeNvRs5R9"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          className="rounded-full flex items-center justify-center cursor-pointer border-2"
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#881FA0',
            borderColor: isDark ? '#5b1470' : '#6b1a80',
          }}
          title="Contact Us"
        >
          <Mail size={18} strokeWidth={2} color="#ffffff" />
        </motion.a>

        {/* Pixel Wallet ($) — solid green circle */}
        <motion.button
          onClick={isPhantom ? undefined : onTokenClick}
          whileHover={isPhantom ? {} : { scale: 1.12 }}
          whileTap={isPhantom ? {} : { scale: 0.92 }}
          className={`rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isPhantom ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#007F36',
            borderColor: isDark ? '#004d20' : '#005c28',
          }}
          title={isPhantom ? "Locked (Phantom Mode)" : "Pixel Wallet"}
          aria-label="Pixel Wallet"
        >
          {isPhantom ? (
            <Lock size={16} color="#ffffff" />
          ) : (
            <span
              style={{
                fontFamily: "'Jersey 15', Montserrat, sans-serif",
                fontWeight: 900,
                fontSize: '20px',
                lineHeight: 1,
                color: '#ffffff',
              }}
            >
              $
            </span>
          )}
        </motion.button>

        {/* Help Hub (?) — solid orange circle */}
        <motion.button
          onClick={isPhantom ? undefined : onSupportClick}
          whileHover={isPhantom ? {} : { scale: 1.12 }}
          whileTap={isPhantom ? {} : { scale: 0.92 }}
          className={`rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isPhantom ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#FE6C17',
            borderColor: isDark ? '#b84a0f' : '#d45610',
          }}
          title={isPhantom ? "Locked (Phantom Mode)" : "Quest"}
          aria-label="Quest"
        >
          {isPhantom ? (
            <Lock size={16} color="#ffffff" />
          ) : (
            <span
              style={{
                fontFamily: "'Jersey 15', Montserrat, sans-serif",
                fontWeight: 900,
                fontSize: '20px',
                lineHeight: 1,
                color: '#ffffff',
              }}
            >
              ?
            </span>
          )}
        </motion.button>

        {/* User Profile / Phantom */}
        {isPhantom ? (
          <motion.div
            onClick={onLobbyClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center cursor-pointer rounded-full overflow-hidden border-2 border-transparent hover:border-gray-500 transition-colors bg-gray-200 dark:bg-gray-800"
            style={{ width: '36px', height: '36px' }}
            title="Return to Sign In"
          >
            <Ghost size={20} color={isDark ? '#e5e7eb' : '#1f2937'} />
          </motion.div>
        ) : (
          <motion.div
            onClick={onUserClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center cursor-pointer rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
            style={{ width: '36px', height: '36px' }}
          >
            <img
              src={userIcon}
              alt="User Profile"
              className="w-full h-full object-contain"
              style={{ filter: isDark ? 'invert(1)' : 'none' }}
            />
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
