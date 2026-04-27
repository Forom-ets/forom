import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LoginScreen } from './components/LoginScreen.tsx'
import { type ForomColor } from './utils/foromColors'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'
import { WalletModal } from './components/WalletModal'
import { QuestModal } from './components/QuestModal'
import { UserModal } from './components/UserModal'
import type { Quest } from './components/QuestModal'
import { HeartFAB } from './components/HeartFAB'
import { RomapModal } from './components/RomapModal'

// Import Icons
import { Lock } from 'lucide-react'
import tokensIcon from './assets/icons/tokens.svg'
import wikiIcon from './assets/icons/wiki.png'
import rubixViewIcon from './assets/icons/rubix_view.svg'

import { SettingsModal } from './components/SettingsModal'
import { SettingsFAB } from './components/SettingsFAB'
import { QUESTION_ORDER, QUESTION_COLORS } from './data/memories'
import { DEFAULT_CATEGORY_LABELS, DEFAULT_QUESTION_LABELS } from './data/forom-config'
import { DEFAULT_PUBLIC_FOROM_MISSION, getInitialQuestsForMission } from './data/quests'

import { useAppStore } from './stores/useAppStore'
import { useModalStore } from './stores/useModalStore'
import { getLevelAndTitle } from './utils/leveling'

// =============================================================================
// TYPES & CONSTANTS
// =============================================================================

export type UserRole = 'S-MODS' | 'MODS' | 'CREATEURS' | 'ASSOCIES' | null;

type BackendUserRole = 'supermoderator' | 'moderator' | 'creator' | 'associate'

export const getUserRole = (role: BackendUserRole | null): UserRole => {
  if (!role) return null;
  if (role === 'supermoderator') return 'S-MODS';
  if (role === 'moderator') return 'MODS';
  if (role === 'creator') return 'CREATEURS';
  return 'ASSOCIES';
}

/** Available categories for the application */
const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

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
      className="relative flex flex-col items-center justify-between rounded-full p-1 cursor-pointer"
      style={{
        width: '28px',
        height: '56px',
        backgroundColor: isDark ? '#3b82f6' : '#e5e7eb',
        border: '2px solid',
        borderColor: isDark ? '#2563eb' : '#d1d5db',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun icon */}
      <span className="text-xs" style={{ opacity: isDark ? 0.4 : 1, lineHeight: 1 }}>☀️</span>
      {/* Moon icon */}
      <span className="text-xs" style={{ opacity: isDark ? 1 : 0.4, lineHeight: 1 }}>🌙</span>
      {/* Toggle knob */}
      <motion.div
        className="absolute rounded-full bg-white shadow-md"
        style={{ width: '20px', height: '20px', left: '2px' }}
        animate={{ top: isDark ? '32px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}

const ETS_CATEGORY_LABELS: Record<string, string> = {
  A: 'Partenaires',
  B: 'Culture',
  C: 'Clubs',
  D: 'Trésorerie',
  E: 'Atelier',
  F: 'Projets',
  G: 'Événements',
  H: 'Rayonnement',
  I: 'Gouvernance',
  J: 'Héritage',
}

const ETS_QUESTION_LABELS: Record<string, string> = {
  '0': 'Idéation',
  '1': 'Recherche',
  '2': 'Conception',
  '3': 'Opération',
  '4': 'Obstacle',
  '5': 'Déploiement',
  '6': 'Tutoriel',
  '7': 'Bilan',
  '8': 'Gabarit (Canon RAG Data)',
  '9': 'Passation',
}

// =============================================================================
// COMPONENT
// =============================================================================

function App() {
  const { phase, setPhase } = useAppStore();
  const modals = useModalStore();

  const [isPhantomMode, setIsPhantomMode] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [currentUserBackendRole, setCurrentUserBackendRole] = useState<BackendUserRole | null>(null)
  const [mission, setMission] = useState('Club étudiants ÉTS')
  const [foromColor, setForomColor] = useState<ForomColor | null>('guardien')
  const [foromRules] = useState<string[]>(['Honnêteté', '', '', '', '', '', '', '', '', 'Curiosité'])
  const [foromFriendKeys] = useState<string[]>(() =>
    Array.from({ length: 8 }, () => 'FRM-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase())
  )
  const [activeCategory, setActiveCategory] = useState('E')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRubixView, setIsRubixView] = useState(false)

  // Economy & Leveling State
  const [pixels, setPixels] = useState(0)
  const [inVault, setInVault] = useState(0) // 5000 reserved
  const [xp, setXp] = useState(0)
  const [personalQuests, setPersonalQuests] = useState<Quest[]>(() => getInitialQuestsForMission(DEFAULT_PUBLIC_FOROM_MISSION))
  const [acceptedQuestId, setAcceptedQuestId] = useState<string | null>(null)
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').trim()

  const completedFoundationalQuestCount = personalQuests.filter(q => q.completed).length
  const seasonPhase: 'V1' | 'V2' | 'V3' = completedFoundationalQuestCount >= 100 ? 'V2' : 'V1'

  const { level, title } = getLevelAndTitle(xp)

  // Initialize customizable labels from the default config.
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>(
    () => ({ ...DEFAULT_CATEGORY_LABELS }),
  )

  const [questionLabels, setQuestionLabels] = useState<Record<string, string>>(
    () => ({ ...DEFAULT_QUESTION_LABELS }),
  )

  // Detect roles
  const userRole = getUserRole(currentUserBackendRole)
  const isSuperModerator = userRole === 'S-MODS'
  const isModerator = userRole === 'MODS'
  const isEtsForom = true

  const activeCategoryLabels = ETS_CATEGORY_LABELS
  const activeQuestionLabels = ETS_QUESTION_LABELS
  const activePersonalQuests: Quest[] = []

  const hydrateUserFromToken = async (fallbackUsername?: string | null) => {
    if (fallbackUsername?.toLowerCase() === 'xylo') {
      setCurrentUser('XYLO')
      setCurrentUserBackendRole('supermoderator')
      setPixels(5000)
      setInVault(5000)
      setIsPhantomMode(false)
      return
    }

    const token = localStorage.getItem('foromAccessToken')

    if (!token) {
      if (fallbackUsername) {
        setCurrentUser(fallbackUsername)
      }
      return
    }

    try {
      const response = await fetch(`${apiBase}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok || !payload?.user) {
        throw new Error('Unable to hydrate user')
      }

      setCurrentUser(payload.user.username || fallbackUsername || null)
      setCurrentUserBackendRole(payload.user.role || null)
      setPixels(Number(payload.user.currency || 0))
      setInVault(payload.user.role === 'supermoderator' ? 5000 : 0)
      setIsPhantomMode(false)
    } catch {
      if (fallbackUsername) {
        setCurrentUser(fallbackUsername)
      }
      setCurrentUserBackendRole(null)
      setPixels(0)
      setInVault(0)
    }
  }

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Consume OAuth callback params after Authentik redirect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authToken = params.get('authToken')
    const oauthUsername = params.get('username')
    const authError = params.get('authError')

    if (!authToken && !oauthUsername && !authError) {
      return
    }

    if (authError) {
      console.error('OAuth callback error:', authError)
    }

    if (authToken) {
      localStorage.setItem('foromAccessToken', authToken)
    }

    if (oauthUsername || authToken) {
      void hydrateUserFromToken(oauthUsername)
      setMission('Club étudiants ÉTS')
      setForomColor('guardien')
      setPhase('grid')
      useModalStore.getState().openUser()
    }

    const cleanedUrl = `${window.location.pathname}${window.location.hash}`
    window.history.replaceState({}, document.title, cleanedUrl)
  }, [apiBase, setPhase])

  // Map categories to sidebar items
  const sidebarItems = CATEGORIES.map((category) => ({
    id: category,
    label: activeCategoryLabels[category] || category,
    disabled: false,
  }))

  const cornerIconStyle = "rounded-full overflow-hidden cursor-pointer shadow-lg hover:shadow-xl border-2 border-transparent transition-all flex items-center justify-center"
  const cornerIconSize = { width: '64px', height: '64px' }

  if (phase === 'login') {
    return (
      <LoginScreen
        isDark={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onGuest={() => {
          setIsPhantomMode(true);
          setCurrentUser(null);
          setCurrentUserBackendRole(null);
          setPixels(0);
          setInVault(0);
          setMission('Club étudiants ÉTS')
          setForomColor('guardien')
          setPhase('grid');
        }}
        onAuthenticated={(username: string) => {
          void hydrateUserFromToken(username)
          setMission('Club étudiants ÉTS')
          setForomColor('guardien')
          setPhase('grid');
          useModalStore.getState().openUser();
        }}
      />
    );
  }

  return (
    <div 
      className="h-screen overflow-hidden relative transition-colors duration-300"
      style={{ backgroundColor: isDarkMode ? '#0D0D0F' : '#FF7878' }}
    >
      {/* Right Column Stack: Theme, Settings */}
      <div 
        className="fixed z-50 flex flex-col items-center"
        style={{ bottom: '48px', right: '3%', gap: '3vh' }}
      >
        <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        
        {/* Quest Hub */}
        <div className="flex flex-col items-center">
          <motion.button
            onClick={isPhantomMode ? undefined : () => modals.openQuest()}
            whileHover={isPhantomMode ? {} : { scale: 1.12 }}
            whileTap={isPhantomMode ? {} : { scale: 0.92 }}
            className={`rounded-full flex items-center justify-center border-2 border-transparent hover:border-orange-500 transition-colors duration-300 ${isPhantomMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            style={{ width: '64px', height: '64px', backgroundColor: 'transparent', marginTop: '1vh' }}
            title={isPhantomMode ? "Locked (Phantom Mode)" : "Quest"}
            aria-label="Quest"
          >
            {isPhantomMode ? (
              <Lock size={16} color="#ffffff" />
            ) : (
              <img src={tokensIcon} alt="Quest" className="w-3/4 h-3/4 object-contain" />
            )}
          </motion.button>
          
        </div>
        </div>

        {/* Left Edge Center: Settings Matrix */}
        {isSuperModerator && (
          <div 
            className="fixed z-50 flex flex-col items-center justify-center pointer-events-auto"
            style={{ top: '50%', left: '1%', transform: 'translateY(-50%)' }}
          >
            <SettingsFAB onClick={modals.openSettings} />
          </div>
        )}

        <Header 
          onTokenClick={modals.openWallet}
        onUserClick={modals.openUser}
        onRomapClick={modals.openRomap}
        seasonPhase={seasonPhase}
        onLobbyClick={() => {
          setPhase('login')
          if (isPhantomMode) {
            setIsPhantomMode(false)
          }
        }}
        isDark={isDarkMode}
        mission={mission}
        isPhantom={isPhantomMode}
      />

      {/* Edge Fade Gradients (Top, Bottom, Left, Right) */}
      {/* Top Edge */}
      <div 
        className="fixed top-0 left-0 right-0 z-20 pointer-events-none transition-colors duration-300"
        style={{ 
          height: '25vh', 
          background: isDarkMode 
            ? 'linear-gradient(to bottom, #0D0D0F 15%, transparent 100%)' 
            : 'linear-gradient(to bottom, #FF7878 15%, transparent 100%)' 
        }}
      />
      {/* Bottom Edge */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none transition-colors duration-300"
        style={{ 
          height: '25vh', 
          background: isDarkMode 
            ? 'linear-gradient(to top, #0D0D0F 15%, transparent 100%)' 
            : 'linear-gradient(to top, #FF7878 15%, transparent 100%)' 
        }}
      />
      {/* Left Edge */}
      <div 
        className="fixed top-0 bottom-0 left-0 z-20 pointer-events-none transition-colors duration-300"
        style={{ 
          width: '5vw', 
          background: isDarkMode 
            ? 'linear-gradient(to right, #0D0D0F 15%, transparent 100%)' 
            : 'linear-gradient(to right, #FF7878 15%, transparent 100%)' 
        }}
      />
      {/* Right Edge */}
      <div 
        className="fixed top-0 bottom-0 right-0 z-20 pointer-events-none transition-colors duration-300"
        style={{ 
          width: '5vw', 
          background: isDarkMode 
            ? 'linear-gradient(to left, #0D0D0F 15%, transparent 100%)' 
            : 'linear-gradient(to left, #FF7878 15%, transparent 100%)' 
        }}
      />

      {/* --------------------------------------------------------------------------
          Corner Icons
      -------------------------------------------------------------------------- */}

      {/* Bottom Left - Heart + Wiki stacked */}
      <div
        className="fixed z-50 flex flex-col items-center"
        style={{ bottom: '48px', left: '3%', gap: '3vh' }}
      >
        <HeartFAB fixed={false} />
        <motion.a
          href="https://wiki.etsmtl.club/share/8cnz7bzxf3/p/services-offerts-j8LxYBFxrs"
          target="_blank"
          rel="noopener noreferrer"
          className={`${cornerIconStyle}`}
          style={{ ...cornerIconSize, backgroundColor: 'transparent', borderColor: 'transparent', marginTop: '1vh' }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={wikiIcon} alt="Wiki" className="w-3/4 h-3/4 object-contain" />
        </motion.a>
      </div>

      {/* Bottom Center - Rubix View Toggle */}
      <div 
        className="fixed z-30 flex justify-center items-center pointer-events-none"
        style={{ bottom: '86px', left: '0', right: '0' }}
      >
        <motion.button
          onClick={() => setIsRubixView(prev => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center shrink-0 pointer-events-auto"
          style={{ width: '56px', height: '56px', background: 'transparent', border: 'none' }}
          title="Toggle Rubix View"
          aria-label="Toggle Rubix View"
        >
          <img src={rubixViewIcon} alt="Rubix View" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        </motion.button>
      </div>

      {/* --------------------------------------------------------------------------
          Main Layout
      -------------------------------------------------------------------------- */}

      {!isRubixView && (
        <Sidebar
          items={sidebarItems}
          activeId={activeCategory}
          onSelect={setActiveCategory}
          isDark={isDarkMode}
          position="right"
        />
      )}

      <CarouselGrid
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isDark={isDarkMode}
        isRubixView={isRubixView}
        onCloseRubix={() => setIsRubixView(false)}
        acceptedQuestId={acceptedQuestId}
        categoryLabels={activeCategoryLabels}
        onQuestComplete={(id) => {
          const quest = personalQuests.find(q => q.id === id)
          if (quest) {
            setPixels(p => Math.round((p + 2.07) * 100) / 100)
            setXp(x => x + 10)
            setPersonalQuests(prev => prev.filter(q => q.id !== id))
            setAcceptedQuestId(null)
          }
        }}
        questionLabels={activeQuestionLabels}
        personalQuests={activePersonalQuests}
        isEmptyGrid={isEtsForom}
      />

      {/* --------------------------------------------------------------------------
          Modals
      -------------------------------------------------------------------------- */}
      <SettingsModal
        isOpen={modals.isSettingsOpen}
        onClose={modals.closeSettings}
        onSave={(newCats, newTags) => {
          setCategoryLabels(newCats)
          setQuestionLabels(newTags)
        }}
        currentCategoryLabels={categoryLabels}
        currentQuestionLabels={questionLabels}
        categories={CATEGORIES}
        questionOrder={QUESTION_ORDER}
        questionColors={QUESTION_COLORS}
      />

      <UserModal
        isOpen={modals.isUserOpen}
        onClose={modals.closeUser}
        pixels={pixels}
        level={level}
        title={title}
        xp={xp}
        isDarkMode={isDarkMode}
        foromColor={foromColor}
        mission={mission}
        currentUser={currentUser}
        isSuperModerator={isSuperModerator}
        userRole={userRole}
        inVault={inVault}
        foromRules={foromRules}
        foromFriendKeys={foromFriendKeys}
      />

      <WalletModal
        isOpen={modals.isWalletOpen}
        onClose={modals.closeWallet}
        pixels={pixels}
        userRole={userRole}
      />

      <RomapModal
        isOpen={modals.isRomapOpen}
        onClose={modals.closeRomap}
        currentPhase={seasonPhase === 'V1' ? 1 : seasonPhase === 'V2' ? 2 : 3}
      />

      <QuestModal
        isOpen={modals.isQuestOpen}
        onClose={modals.closeQuest}
        personalQuests={personalQuests}
        acceptedQuestId={acceptedQuestId}
        questionLabels={questionLabels}
        categoryLabels={categoryLabels}
        categories={CATEGORIES as unknown as string[]}
        seasonPhase={seasonPhase}
        pixels={pixels}
        canCreateQuest={isSuperModerator || isModerator}
        userRole={userRole}
        onCreateQuest={(title, reward, question, category) => {
          const cost = seasonPhase === 'V1' ? 2 : 1;
          if (pixels < cost) return;
          // Deduct
          setPixels(p => Math.max(0, p - cost));
          
          setPersonalQuests(prev => {
            return [...prev, { id: Date.now().toString(), title, reward, question, category }]
          })
        }}
        onAcceptQuest={(id) => {
          setPersonalQuests(prev => prev.map(q => q.id === id ? { ...q, taken: true } : q))
          setAcceptedQuestId(id)
        }}
        onCompleteQuest={(id) => {
          const quest = personalQuests.find(q => q.id === id)
          if (quest) {
            // Fixed reward: 2 pixels + 10 XP per completed quest
            setPixels(p => Math.round((p + 2.00) * 100) / 100)
            setXp(x => x + 10)
            setPersonalQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true, taken: false, completedBy: currentUser || undefined } : q))
            if (acceptedQuestId === id) setAcceptedQuestId(null)
          }
        }}
        onCancelQuest={(id) => {
          setPersonalQuests(prev => prev.map(q => q.id === id ? { ...q, taken: false } : q))
          if (acceptedQuestId === id) setAcceptedQuestId(null)
        }}
      />

    </div>
  )
}

export default App

