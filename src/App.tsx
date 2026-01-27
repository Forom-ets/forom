import { useState, useEffect } from 'react'
import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'
import { SupportModal } from './components/SupportModal'

// Import Icons
import userIcon from './assets/icons/user.png'
import etsIcon from './assets/icons/ets.jpg'
import wikiIcon from './assets/icons/wiki.png'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Available categories for the application */
const CATEGORIES = ['Partenaires', 'Culture', 'Clubs', 'Trésorie', 'Atelier']

// =============================================================================
// MODAL STYLES
// =============================================================================

const tokenModalStyles: ReactModal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    width: '600px',
    height: '400px',
    padding: 0,
    border: 'none',
    background: 'transparent',
    overflow: 'visible',
    borderRadius: 0,
  },
}

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
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
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/** Simple Modal Component */
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={tokenModalStyles}
          closeTimeoutMS={200}
          contentLabel={title}
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
          ariaHideApp={true}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full h-full rounded-xl shadow-2xl p-8 flex flex-col border-4 transition-colors duration-300"
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-['Montserrat']">{title}</h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors cursor-pointer"
                style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                type="button"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              {children}
            </div>
          </motion.div>
        </ReactModal>
      )}
    </AnimatePresence>
  )
}

/** Modern Theme Toggle Switch */
function ThemeToggle({ 
  isDark, 
  onToggle 
}: { 
  isDark: boolean
  onToggle: () => void 
}) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative flex items-center justify-between rounded-full p-1 cursor-pointer"
      style={{
        width: '56px',
        height: '28px',
        backgroundColor: isDark ? '#3b82f6' : '#e5e7eb',
        border: '2px solid',
        borderColor: isDark ? '#2563eb' : '#d1d5db',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun icon */}
      <span className="text-xs" style={{ opacity: isDark ? 0.4 : 1 }}>☀️</span>
      {/* Moon icon */}
      <span className="text-xs" style={{ opacity: isDark ? 1 : 0.4 }}>🌙</span>
      {/* Toggle knob */}
      <motion.div
        className="absolute rounded-full bg-white shadow-md"
        style={{ width: '20px', height: '20px', top: '2px' }}
        animate={{ left: isDark ? '32px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

function App() {
  const [activeCategory, setActiveCategory] = useState('Clubs')
  const [activeModal, setActiveModal] = useState<'token' | 'support' | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Map categories to sidebar items
  const sidebarItems = CATEGORIES.map((category) => ({
    id: category,
    label: category,
    disabled: false,
  }))

  const cornerIconStyle = "rounded-full overflow-hidden cursor-pointer shadow-lg hover:shadow-xl border-2 border-transparent transition-all flex items-center justify-center"
  const cornerIconSize = { width: '64px', height: '64px' }

  return (
    <div 
      className="h-screen overflow-hidden relative transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Theme Toggle - Bottom Right */}
      <div 
        className="fixed z-50 flex items-center gap-2"
        style={{ bottom: '32px', right: '32px' }}
      >
        <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      </div>
      <Header 
        onTokenClick={() => setActiveModal('token')}
        onSupportClick={() => setActiveModal('support')}
        isDark={isDarkMode}
      />

      {/* --------------------------------------------------------------------------
          Corner Icons
      -------------------------------------------------------------------------- */}

      {/* Top Left - ETS */}
      <motion.a
        href="https://www.etsmtl.ca/experience-etudiante/clubs-etudiants"
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute z-50 ${cornerIconStyle}`}
        style={{ ...cornerIconSize, top: '32px', left: '32px', backgroundColor: 'transparent', borderColor: 'transparent' }}
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={etsIcon} alt="ÉTS Montréal" className="w-3/4 h-3/4 object-contain" />
      </motion.a>

      {/* Top Right - User */}
      <motion.div
        className={`absolute z-50 ${cornerIconStyle}`}
        style={{ ...cornerIconSize, top: '32px', right: '32px', backgroundColor: 'transparent', borderColor: 'transparent' }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={userIcon}
          alt="User Profile"
          className="w-3/4 h-3/4 object-contain"
          style={{ filter: isDarkMode ? 'invert(1)' : 'none' }}
        />
      </motion.div>

      {/* Bottom Left - Wiki */}
      <motion.a
        href="https://wiki.etsmtl.club/share/8cnz7bzxf3/p/services-offerts-j8LxYBFxrs"
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute z-50 ${cornerIconStyle}`}
        style={{ ...cornerIconSize, bottom: '32px', left: '32px', backgroundColor: 'transparent', borderColor: 'transparent' }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={wikiIcon} alt="Wiki" className="w-3/4 h-3/4 object-contain" />
      </motion.a>

      {/* --------------------------------------------------------------------------
          Main Layout
      -------------------------------------------------------------------------- */}

      <Sidebar
        items={sidebarItems}
        activeId={activeCategory}
        onSelect={setActiveCategory}
        isDark={isDarkMode}
      />

      <CarouselGrid
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isDark={isDarkMode}
      />

      {/* --------------------------------------------------------------------------
          Modals
      -------------------------------------------------------------------------- */}

      <Modal 
        isOpen={activeModal === 'token'} 
        onClose={() => setActiveModal(null)}
        title="The FOROM Ecosystem"
      >
        <div className="flex flex-col gap-4">
          <p className="text-lg font-medium text-zinc-600 dark:text-zinc-300">Learn to earn. Support to build.</p>

          <section className="pt-2 pb-2">
            <h3 className="text-xl font-semibold text-black dark:text-white">How to Earn</h3>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Knowledge is currency here. For every tutorial you complete, you automatically earn <span className="font-semibold">1,000 Tokens</span>.
              The more you learn, the more you collect.
            </p>
          </section>

          <section className="pt-2 pb-2">
            <h3 className="text-xl font-semibold text-black dark:text-white">How to Support</h3>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Want to push the project further? You can acquire tokens to directly finance the development team.
              Your contributions help us create new iterations, fund new projects, and improve the application faster.
            </p>
          </section>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
              Whether you earn them or buy them, your tokens fuel the collective. Use them to vote on the next big update.
            </p>
          </div>
        </div>
      </Modal>

      <SupportModal 
        isOpen={activeModal === 'support'} 
        onClose={() => setActiveModal(null)}
      />

    </div>
  )
}

export default App
