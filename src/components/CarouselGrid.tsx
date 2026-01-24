import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'

interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  views: string
  channel: string
}

interface CarouselGridProps {
  videos: Video[]
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const categoryColors: Record<string, string> = {
  Partenaires: 'border-green-500 shadow-lg shadow-green-500/50',
  Culture: 'border-purple-500 shadow-lg shadow-purple-500/50',
  Clubs: 'border-red-500 shadow-lg shadow-red-500/50',
  Trésorerie: 'border-yellow-500 shadow-lg shadow-yellow-500/50',
  Atelier: 'border-blue-500 shadow-lg shadow-blue-500/50',
}

export function CarouselGrid({
  videos,
  categories,
  activeCategory,
  onCategoryChange,
}: CarouselGridProps) {
  const [horizontalIndex, setHorizontalIndex] = React.useState(0)
  const activeIndex = categories.indexOf(activeCategory)

  const visibleCount = 5
  const startIdx = horizontalIndex
  const activeRowVideos = videos.slice(startIdx, startIdx + visibleCount)
  const topRowVideos = videos.slice(0, 3)
  const bottomRowVideos = videos.slice(3, 6)

  const handlePrevCategory = () => {
    const newIndex = (activeIndex - 1 + categories.length) % categories.length
    onCategoryChange(categories[newIndex])
    setHorizontalIndex(0)
  }

  const handleNextCategory = () => {
    const newIndex = (activeIndex + 1) % categories.length
    onCategoryChange(categories[newIndex])
    setHorizontalIndex(0)
  }

  const handlePrevVideo = () => {
    if (horizontalIndex > 0) {
      setHorizontalIndex(horizontalIndex - 1)
    }
  }

  const handleNextVideo = () => {
    if (startIdx + visibleCount < videos.length) {
      setHorizontalIndex(horizontalIndex + 1)
    }
  }

  const renderVideoCard = (video: Video, scale: number, zIndex: number, width: string) => (
    <motion.div
      key={video.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale }}
      transition={{ type: 'spring', damping: 12, stiffness: 100 }}
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${width} ${
        scale === 1 ? 'h-64' : scale === 0.8 ? 'h-48' : 'h-32'
      } flex-shrink-0`}
      style={{ zIndex }}
    >
      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
      {scale === 1 && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </motion.div>
  )

  const renderRow = (rowVideos: Video[], isActive: boolean) => {
    const centerIdx = Math.floor(visibleCount / 2)

    return (
      <motion.div
        initial={{ opacity: 0, y: isActive ? 0 : 20 }}
        animate={{ opacity: isActive ? 1 : 0.5, y: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className={`flex items-center justify-center gap-4 ${
          isActive ? 'h-96' : 'h-32'
        } flex-shrink-0`}
      >
        {rowVideos.map((video, idx) => {
          if (!isActive) {
            return renderVideoCard(video, 0.6, 1, 'w-40')
          }

          const relativeIdx = idx
          if (relativeIdx === centerIdx - 2) return renderVideoCard(video, 0.6, 1, 'w-40')
          if (relativeIdx === centerIdx - 1) return renderVideoCard(video, 0.8, 5, 'w-60')
          if (relativeIdx === centerIdx) return renderVideoCard(video, 1, 10, 'w-96')
          if (relativeIdx === centerIdx + 1) return renderVideoCard(video, 0.8, 5, 'w-60')
          if (relativeIdx === centerIdx + 2) return renderVideoCard(video, 0.6, 1, 'w-40')
          return null
        })}
      </motion.div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8 ml-32">
      {/* Vertical Navigation */}
      <div className="flex items-center gap-12">
        <div className="flex flex-col items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevCategory}
            className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
          >
            <ChevronUp size={24} className="text-gray-900" />
          </motion.button>

          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <div className="w-0.5 h-20 bg-gray-600 rounded-full" />
            <div className="w-3 h-3 rounded-full bg-gray-900" />
            <div className="w-0.5 h-20 bg-gray-600 rounded-full" />
          </div>

          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextCategory}
            className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
          >
            <ChevronDown size={24} className="text-gray-900" />
          </motion.button>
        </div>

        {/* Grid Container */}
        <div className="flex flex-col items-center justify-center gap-6 flex-1">
          {/* Top Row */}
          {renderRow(topRowVideos, false)}

          {/* Active Row with colored border */}
          <motion.div
            className={`border-4 ${categoryColors[activeCategory] || 'border-gray-900'} rounded-lg p-4`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          >
            {renderRow(activeRowVideos, true)}
          </motion.div>

          {/* Bottom Row */}
          {renderRow(bottomRowVideos, false)}
        </div>
      </div>

      {/* Horizontal Navigation */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevVideo}
          disabled={horizontalIndex === 0}
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </motion.button>

        <div className="flex items-center gap-2">
          <div className="w-32 h-1 bg-gray-400 rounded-full relative">
            <motion.div
              className="absolute h-1 bg-gray-900 rounded-full"
              animate={{
                width: `${Math.max(10, (horizontalIndex / Math.max(1, videos.length - visibleCount)) * 100)}%`,
              }}
            />
          </div>
          <div className="w-3 h-3 rounded-full bg-gray-900" />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextVideo}
          disabled={startIdx + visibleCount >= videos.length}
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={24} className="text-gray-900" />
        </motion.button>
      </div>
    </div>
  )
}
