import { motion } from 'framer-motion'

export function Header() {
  const letters = [
    { text: 'F', color: 'text-red-600' },
    { text: 'O', color: 'text-gray-900' },
    { text: 'R', color: 'text-yellow-400' },
    { text: 'O', color: 'text-gray-900' },
    { text: 'M', color: 'text-blue-600' },
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 py-6 px-8"
    >
      <div className="flex items-center justify-center gap-2">
        {letters.map((letter, index) => (
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
            className={`text-5xl font-black ${letter.color}`}
          >
            {letter.text}
          </motion.span>
        ))}
      </div>
    </motion.header>
  )
}
