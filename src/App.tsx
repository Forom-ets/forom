import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'

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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60] cursor-pointer"
          />
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white rounded-xl shadow-2xl z-[70] p-8 flex flex-col border-4 border-black"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-['Montserrat']">{title}</h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto text-lg text-gray-600">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

function App() {
  const [activeCategory, setActiveCategory] = useState('Clubs')
  const [activeModal, setActiveModal] = useState<'token' | 'support' | null>(null)

  // Map categories to sidebar items
  const sidebarItems = CATEGORIES.map((category) => ({
    id: category,
    label: category,
    disabled: false,
  }))

  const cornerIconStyle = "rounded-full overflow-hidden cursor-pointer shadow-lg hover:shadow-xl bg-white border-2 border-transparent hover:border-black transition-all flex items-center justify-center"
  const cornerIconSize = { width: '64px', height: '64px' } // Explicit sizing

  return (
    <div className="h-screen bg-white overflow-hidden relative">
      <Header 
        onTokenClick={() => setActiveModal('token')}
        onSupportClick={() => setActiveModal('support')}
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
        style={{ ...cornerIconSize, top: '32px', left: '32px' }}
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={etsIcon} alt="ÉTS Montréal" className="w-3/4 h-3/4 object-contain" />
      </motion.a>

      {/* Top Right - User */}
      <motion.div
        className={`absolute z-50 ${cornerIconStyle}`}
        style={{ ...cornerIconSize, top: '32px', right: '32px' }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={userIcon} alt="User Profile" className="w-full h-full object-cover" />
      </motion.div>

      {/* Bottom Left - Wiki */}
      <motion.a
        href="https://cedille.etsmtl.ca/"
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute z-50 ${cornerIconStyle}`}
        style={{ ...cornerIconSize, bottom: '32px', left: '32px' }}
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
      />

      <CarouselGrid
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* --------------------------------------------------------------------------
          Modals
      -------------------------------------------------------------------------- */}

      <Modal 
        isOpen={activeModal === 'token'} 
        onClose={() => setActiveModal(null)}
        title="Forom Tokens"
      >
        <div className="flex flex-col gap-4">
          <p>
            Welcome to the Token system explanation.
          </p>
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 italic border-2 border-dashed border-gray-300">
            Token Info Placeholder
          </div>
          <p className="text-sm">
            This container will be populated with more detailed information about how tokens work within the Forom ecosystem later.
          </p>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'support'} 
        onClose={() => setActiveModal(null)}
        title="Support Center"
      >
        <div className="flex flex-col gap-4">
          <p>
            Need help? Here is how support works at Forom.
          </p>
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 italic border-2 border-dashed border-gray-300">
            Support Info Placeholder
          </div>
          <p className="text-sm">
            Contact us for technical assistant or platform guidance.
          </p>
        </div>
      </Modal>

    </div>
  )
}

export default App
