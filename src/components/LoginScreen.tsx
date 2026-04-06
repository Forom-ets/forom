import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import chromaPortalIcon from '../assets/icons/chroma_portal.svg'
import etsIcon from '../assets/icons/ets.jpg'
import githubIcon from '../assets/icons/github.png'
import foromLogoWht from '../assets/icons/forom_logo_wht.png'

interface LoginScreenProps {
  onAuthenticated: (username: string) => void
  onGuest: () => void
  isDark: boolean
  onToggleDarkMode: () => void
}

export function LoginScreen({ onAuthenticated, onGuest, isDark, onToggleDarkMode }: LoginScreenProps) {
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [loginUsernameInput, setLoginUsernameInput] = useState('')
  const [loginPasswordInput, setLoginPasswordInput] = useState('')
  const [signupUsernameInput, setSignupUsernameInput] = useState('')
  const [signupEmailInput, setSignupEmailInput] = useState('')
  const [signupPasswordInput, setSignupPasswordInput] = useState('')
  const [signupConfirmPasswordInput, setSignupConfirmPasswordInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').trim()

  const clearAuthForms = () => {
    setLoginUsernameInput('')
    setLoginPasswordInput('')
    setSignupUsernameInput('')
    setSignupEmailInput('')
    setSignupPasswordInput('')
    setSignupConfirmPasswordInput('')
    setAuthError('')
  }

  const closeAuthModal = () => {
    setIsSignInOpen(false)
    clearAuthForms()
  }

  const handleLoginAuth = async () => {
    const username = loginUsernameInput.trim()
    const password = loginPasswordInput

    if (!username || !password) {
      setAuthError("Entre ton nom d'utilisateur et ton mot de passe.")
      return
    }

    setIsSubmitting(true)
    setAuthError('')

    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setAuthError(payload?.message || 'Connexion impossible.')
        return
      }

      if (payload?.accessToken) {
        localStorage.setItem('foromAccessToken', payload.accessToken)
      }

      const resolvedUsername = payload?.user?.username || username
      closeAuthModal()
      onAuthenticated(resolvedUsername)
    } catch {
      setAuthError('Le serveur est indisponible.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignupAuth = async () => {
    const username = signupUsernameInput.trim()
    const email = signupEmailInput.trim().toLowerCase()
    const password = signupPasswordInput
    const confirmPassword = signupConfirmPasswordInput

    if (!username || !email || !password || !confirmPassword) {
      setAuthError("Remplis tous les champs pour t'inscrire.")
      return
    }

    if (password !== confirmPassword) {
      setAuthError('La confirmation du mot de passe ne correspond pas.')
      return
    }

    setIsSubmitting(true)
    setAuthError('')

    try {
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setAuthError(payload?.message || 'Inscription impossible.')
        return
      }

      if (payload?.accessToken) {
        localStorage.setItem('foromAccessToken', payload.accessToken)
      }

      closeAuthModal()
      onAuthenticated(payload?.user?.username || username)
    } catch {
      setAuthError('Le serveur est indisponible.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAuthentikAuth = () => {
    window.location.href = `${apiBase}/api/auth/authentik`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: isDark ? '#0D0D0F' : '#FF7878',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '24px 28px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ position: 'absolute', top: '24px', left: '28px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onGuest}
          style={{
            width: '48px',
            height: '48px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Explorer sans connexion"
        >
          <img src={chromaPortalIcon} alt="Explorer" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
        </button>
        <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '40px', letterSpacing: '0.04em' }}>EXPLORER</span>
      </div>

      <div style={{ position: 'absolute', top: '24px', right: '28px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ fontFamily: "'Jersey 15', sans-serif", fontSize: '40px', letterSpacing: '0.04em' }}>COLLABORER</span>
        <a href="https://github.com/Forom-ets/forom" target="_blank" rel="noopener noreferrer" aria-label="GitHub Forom">
          <img src={githubIcon} alt="GitHub" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </a>
      </div>

      <div style={{ position: 'absolute', left: '46px', top: '130px', bottom: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
        <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: '0.22em', fontSize: '40px', fontFamily: "'Jersey 15', sans-serif" }}>FOROM.XYZ</div>
        <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: '0.22em', fontSize: '40px', fontFamily: "'Jersey 15', sans-serif" }}>PIXELS</div>
      </div>

      <div style={{ position: 'absolute', right: '46px', top: '130px', bottom: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
        <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: '0.22em', fontSize: '40px', fontFamily: "'Jersey 15', sans-serif" }}>OPEN SOURCE</div>
        <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: '0.22em', fontSize: '40px', fontFamily: "'Jersey 15', sans-serif" }}>QUETES</div>
      </div>

      <div style={{ marginTop: '96px', flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
          <img src={etsIcon} alt="ÉTS" style={{ width: '136px', height: '136px', objectFit: 'cover', borderRadius: '10px' }} />

          <h1 style={{ margin: 0, fontFamily: "'Jersey 15', sans-serif", fontSize: '56px', letterSpacing: '0.02em', textAlign: 'center' }}>
            Club etudiants de l'ETS
          </h1>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsSignInOpen(true)}
            style={{
              border: 'none',
              borderRadius: '999px',
              backgroundColor: '#F2F2F2',
              color: '#F39C12',
              cursor: 'pointer',
              padding: '14px 54px',
              fontFamily: "'Jersey 15', sans-serif",
              fontSize: '48px',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            AUTHENTIK ETS
          </motion.button>

          <p style={{ margin: 0, fontFamily: "'Jersey 15', sans-serif", fontSize: '30px', opacity: 0.95 }}>
            Espace prive et protege par CEDILLE
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
        <motion.button
          onClick={onToggleDarkMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '56px',
            height: '28px',
            borderRadius: '999px',
            border: '2px solid',
            borderColor: isDark ? '#2563eb' : '#d1d5db',
            backgroundColor: isDark ? '#3b82f6' : '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 6px',
            cursor: 'pointer',
            position: 'relative',
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span style={{ fontSize: '12px', opacity: isDark ? 0.4 : 1 }}>☀️</span>
          <span style={{ fontSize: '12px', opacity: isDark ? 1 : 0.4 }}>🌙</span>
          <motion.div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              position: 'absolute',
              top: '2px',
            }}
            animate={{ left: isDark ? '32px' : '2px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.button>
        <img src={foromLogoWht} alt="FOROM" style={{ width: '168px', objectFit: 'contain' }} />
        <div style={{
          width: '24px',
          height: '12px',
          borderRadius: '999px',
          backgroundColor: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '9px',
          color: '#93C5FD',
          fontFamily: "'JetBrains Mono', monospace",
        }}>0</div>
      </div>

      <AnimatePresence>
        {isSignInOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '32px',
                width: '90%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px',
                position: 'relative',
              }}
            >
              <button
                onClick={closeAuthModal}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                x
              </button>

              <h2 style={{
                fontFamily: "'Jersey 15', sans-serif",
                fontSize: '32px',
                color: '#FFD700',
                margin: 0,
                letterSpacing: '0.1em',
              }}>CONNEXION</h2>

              <div style={{
                width: '100%',
                maxWidth: '340px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => {
                    setAuthMode('login')
                    setAuthError('')
                  }}
                  style={{
                    padding: '10px 8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: authMode === 'login' ? '#5B9F65' : 'transparent',
                    color: authMode === 'login' ? '#fff' : 'rgba(255,255,255,0.75)',
                    fontWeight: 700,
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: '0.04em',
                  }}
                >
                  CONNEXION
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup')
                    setAuthError('')
                  }}
                  style={{
                    padding: '10px 8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: authMode === 'signup' ? '#5B9F65' : 'transparent',
                    color: authMode === 'signup' ? '#fff' : 'rgba(255,255,255,0.75)',
                    fontWeight: 700,
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: '0.04em',
                  }}
                >
                  INSCRIPTION
                </button>
              </div>

              <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {authMode === 'login' ? (
                  <>
                    <input
                      type="text"
                      autoFocus
                      placeholder="NOM D'UTILISATEUR"
                      value={loginUsernameInput}
                      onChange={e => setLoginUsernameInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleLoginAuth()
                        }
                      }}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        margin: '0 auto',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '14px',
                        outline: 'none',
                        textAlign: 'center',
                      }}
                    />

                    <input
                      type="password"
                      placeholder="MOT DE PASSE"
                      value={loginPasswordInput}
                      onChange={e => setLoginPasswordInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleLoginAuth()
                        }
                      }}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        margin: '0 auto',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '14px',
                        outline: 'none',
                        textAlign: 'center',
                      }}
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      autoFocus
                      placeholder="NOM D'UTILISATEUR"
                      value={signupUsernameInput}
                      onChange={e => setSignupUsernameInput(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        margin: '0 auto',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '14px',
                        outline: 'none',
                        textAlign: 'center',
                      }}
                    />

                    <input
                      type="email"
                      placeholder="ADRESSE EMAIL"
                      value={signupEmailInput}
                      onChange={e => setSignupEmailInput(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        margin: '0 auto',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '14px',
                        outline: 'none',
                        textAlign: 'center',
                      }}
                    />

                    <input
                      type="password"
                      placeholder="MOT DE PASSE"
                      value={signupPasswordInput}
                      onChange={e => setSignupPasswordInput(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        margin: '0 auto',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '14px',
                        outline: 'none',
                        textAlign: 'center',
                      }}
                    />

                    <input
                      type="password"
                      placeholder="CONFIRMATION MDP"
                      value={signupConfirmPasswordInput}
                      onChange={e => setSignupConfirmPasswordInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleSignupAuth()
                        }
                      }}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        margin: '0 auto',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '14px',
                        outline: 'none',
                        textAlign: 'center',
                      }}
                    />
                  </>
                )}
              </div>

              <button
                disabled={isSubmitting}
                onClick={authMode === 'login' ? handleLoginAuth : handleSignupAuth}
                style={{
                  background: isSubmitting ? 'rgba(91,159,101,0.4)' : '#5B9F65',
                  color: 'white',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '24px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s',
                  width: '100%',
                  maxWidth: '340px',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {isSubmitting ? 'EN COURS...' : authMode === 'login' ? 'SE CONNECTER' : "S'INSCRIRE"}
              </button>

              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.6 }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                <span style={{ fontSize: '11px', letterSpacing: '0.08em' }}>OU</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              </div>

              <button
                onClick={handleAuthentikAuth}
                style={{
                  background: '#0F172A',
                  color: '#60A5FA',
                  border: '1px solid #60A5FA',
                  padding: '12px 32px',
                  borderRadius: '24px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  width: '100%',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                CONTINUER AVEC AUTHENTIK
              </button>

              {authError && (
                <p style={{
                  margin: 0,
                  width: '100%',
                  color: '#FCA5A5',
                  fontSize: '12px',
                  textAlign: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {authError}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
