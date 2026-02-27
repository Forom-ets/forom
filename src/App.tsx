import { useState, useEffect } from 'react'
import ReactModal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'
import { SupportModal } from './components/SupportModal'

// Import Icons
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
    width: '90vw',
    maxWidth: '1200px',
    height: 'auto',
    maxHeight: '90vh',
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
            className="w-full h-full flex flex-col relative"
            style={{ 
              backgroundColor: '#5FCB76', 
              border: '8px solid black',
              borderRadius: '38px',
              color: 'white'
            }}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-[#FF4B4B] hover:bg-[#ff3333] transition-colors z-10"
              type="button"
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="flex-1 overflow-auto p-12">
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
        style={{ bottom: '48px', right: '3%' }}
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

      {/* Bottom Left - Wiki */}
      <motion.a
        href="https://wiki.etsmtl.club/share/8cnz7bzxf3/p/services-offerts-j8LxYBFxrs"
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute z-50 ${cornerIconStyle}`}
        style={{ ...cornerIconSize, bottom: '48px', left: '3%', backgroundColor: 'transparent', borderColor: 'transparent' }}
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
        title="PIXELS"
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-8">
            <div className="flex-1 pb-4">
              <h2 className="font-montserrat font-black text-[#FFD700] text-2xl tracking-wide">L'économie des pixels</h2>
            </div>
            
            <div className="flex-shrink-0 px-4">
              <h1 className="font-jersey-10 text-white text-[100px] tracking-widest drop-shadow-md m-0 leading-none">PIXELS</h1>
            </div>
            
            <div className="flex-1 text-right pb-4">
              <h2 className="font-montserrat font-black text-[#FFD700] text-2xl tracking-wide">The Pixel Economy</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-16 text-white font-jetbrains text-sm leading-relaxed">
            {/* Left Column - French */}
            <div className="space-y-6">
              <div>
                <h3 className="font-montserrat font-bold text-white text-lg">Connaissances et récompenses</h3>
              </div>
              <p>
                Dans la grille interactive FOROM, l'économie est conçue pour encourager les contributions éducatives et le partage de connaissances.
              </p>
              
              <ul className="space-y-4">
                <li>
                  <span className="font-bold">• Les couleurs comme catégories :</span> La grille est organisée par couleurs distinctes, chaque couleur représentant une catégorie, un sujet ou un thème spécifique. Cela fait du tableau une carte visuellement organisée de différents sujets.
                </li>
                <li>
                  <span className="font-bold">• Gagner des pixels :</span> Les pixels servent de monnaie officielle à la plateforme. Les utilisateurs gagnent cette monnaie en contribuant activement à la communauté - plus précisément, en créant et en publiant des tutoriels utiles au sein des catégories de la grille.
                </li>
                <li>
                  <span className="font-bold">• Les 9 super modérateurs :</span> Les neuf super modérateurs agissent comme les gestionnaires économiques de la plateforme. Plutôt que de rivaliser pour l'espace, ils supervisent le système de récompenses. Chaque modérateur est responsable de définir un catalogue unique de « cadeaux » ou d'avantages.
                </li>
                <li>
                  <span className="font-bold">• Le système d'échange :</span> Une fois qu'un utilisateur a gagné des pixels grâce à ses tutoriels, il peut s'adresser aux super modérateurs pour échanger sa monnaie. Comme les modérateurs gèrent leurs propres récompenses, les utilisateurs peuvent magasiner et échanger leurs pixels contre les cadeaux spécifiques qui les intéressent le plus.
                </li>
              </ul>
            </div>

            {/* Right Column - English */}
            <div className="space-y-6">
              <div className="text-right">
                <h3 className="font-montserrat font-bold text-white text-lg">Knowledge Creation and Rewards</h3>
              </div>
              <p>
                In the FOROM interactive grid, the economy is built around incentivizing educational contributions and knowledge sharing.
              </p>
              
              <ul className="space-y-4">
                <li>
                  <span className="font-bold">• Colors as Categories:</span> The grid is organized by distinct colors, with each color representing a specific category, subject, or theme. This makes the board a visually organized map of different topics.
                </li>
                <li>
                  <span className="font-bold">• Earning Pixels:</span> Pixels serve as the platform's official currency. Users earn this currency by actively contributing to the community-specifically, by creating and publishing helpful tutorials within the grid's categories.
                </li>
                <li>
                  <span className="font-bold">• The 9 Super Moderators:</span> The nine super moderators act as the economic managers of the platform. Rather than competing for space, they oversee the reward system. Each moderator is responsible for defining a unique catalog of "gifts" or perks.
                </li>
                <li>
                  <span className="font-bold">• The Exchange System:</span> Once a user earns pixels from their tutorials, they can approach the super moderators to trade their currency. Because the moderators curate their own rewards, users can shop around and exchange their pixels for the specific gifts that appeal to them the most.
                </li>
              </ul>
            </div>
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
