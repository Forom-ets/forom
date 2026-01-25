import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X } from 'lucide-react'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 cursor-pointer"
          />

          {/* Modal Container (match Token modal position/size) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-xl shadow-2xl z-[70] p-4 border-4 flex flex-col"
          >
            <div className="rounded-xl w-full h-full p-1 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400">
              <div
                className={`relative w-full h-full px-4 sm:px-6 overflow-hidden rounded-lg shadow-2xl`}
                style={{
                  height: '100%',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full text-zinc-500 hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col text-left p-6 sm:p-8 overflow-auto h-full">
                  <header className="mb-4">
                    <h2 className="text-2xl font-black text-black dark:text-white">Fuel the Collective</h2>
                    <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">Break individualism. Back the project.</p>
                  </header>

                  <main className="flex-1 space-y-4">
                    <section>
                      <h3 className="text-lg font-semibold text-black dark:text-white">Main Explanation</h3>
                      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        This is more than a 'Like' button. It is a direct investment in the platform's future. Use the tokens you earned from tutorials—or your own contributions—to support the app.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-black dark:text-white">The Impact</h3>
                      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        Every token you drop here acts as a vote of confidence. These contributions directly finance new iterations, allowing the team to develop features faster and expand the FOROM ecosystem.
                      </p>
                    </section>
                  </main>

                  <footer className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm italic text-zinc-500 dark:text-zinc-400">Don't just consume the content. Empower it.</p>
                  </footer>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
