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

const VISIBLE_VIDEOS = 5

export function CarouselGrid({
  videos,
  categories,
  activeCategory,
  onCategoryChange,
}: CarouselGridProps) {
  const [horizontalIndex, setHorizontalIndex] = React.useState(0)
  const activeIndex = categories.indexOf(activeCategory)

  // Calculate video slices for different rows
  const startIdx = horizontalIndex
  const activeRowVideos = videos.slice(startIdx, startIdx + VISIBLE_VIDEOS)
  const topRowVideos = videos.slice(0, 3)
  const bottomRowVideos = videos.slice(3, 6)

  // Handlers for category navigation
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

  // Handlers for video carousel navigation
  const handlePrevVideo = () => {
    if (horizontalIndex > 0) {
      setHorizontalIndex(horizontalIndex - 1)
    }
  }

  const handleNextVideo = () => {
    if (startIdx + VISIBLE_VIDEOS < videos.length) {
      setHorizontalIndex(horizontalIndex + 1)
    }
  }

  /**
   * Renders a video card with scaling animation
   * @param video - Video object to render
   * @param scale - Scale factor (0.6, 0.8, or 1)
   * @param zIndex - Z-index for layering
   * @param width - Tailwind width class
   */
  const renderVideoCard = (
    video: Video,
    scale: number,
    zIndex: number
  ) => (
    <motion.div
      key={video.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale }}
      transition={{ type: 'spring', damping: 12, stiffness: 100 }}
      className="relative rounded-lg overflow-hidden cursor-pointer transition-all flex-shrink-0"
      style={{
        zIndex,
        width: scale === 1 ? 'clamp(15rem, 35vw, 32rem)' : scale === 0.8 ? 'clamp(12rem, 28vw, 24rem)' : 'clamp(8rem, 18vw, 16rem)',
        height: scale === 1 ? 'clamp(12rem, 26vw, 28rem)' : scale === 0.8 ? 'clamp(9rem, 20vw, 22rem)' : 'clamp(6rem, 14vw, 14rem)',
      }}
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

  /**
   * Renders a row of videos with perspective scaling
   * @param rowVideos - Array of videos to display
   * @param isActive - Whether this is the active middle row
   */
  const renderRow = (rowVideos: Video[], isActive: boolean) => {
    const centerIdx = Math.floor(VISIBLE_VIDEOS / 2)

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
            return renderVideoCard(video, 0.6, 1)
          }

          // For active row, apply perspective scaling based on position
          const relativeIdx = idx
          if (relativeIdx === centerIdx - 2) return renderVideoCard(video, 0.6, 1)
          if (relativeIdx === centerIdx - 1) return renderVideoCard(video, 0.8, 5)
          if (relativeIdx === centerIdx) return renderVideoCard(video, 1, 10)
          if (relativeIdx === centerIdx + 1) return renderVideoCard(video, 0.8, 5)
          if (relativeIdx === centerIdx + 2) return renderVideoCard(video, 0.6, 1)
          return null
        })}
      </motion.div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8" style={{ gap: 'clamp(1.5rem, 4vw, 2rem)', marginLeft: 'clamp(4rem, 12vw, 10rem)' }}>
      {/* Vertical Navigation + Grid Container */}
      <div className="flex items-center gap-12">
        {/* Category Navigation (Vertical) */}
        <div className="flex flex-col items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevCategory}
            className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
            style={{ fontFamily: "'Jersey 15'" }}
            aria-label="Previous category"
          >
            <ChevronUp size={24} className="text-gray-900" />
          </motion.button>

          {/* Navigation indicator */}
          <div className="flex flex-col items-center justify-center relative" style={{ height: '200px', width: '20px', position: 'relative' }}>
            <div style={{ position: 'absolute', width: '4px', height: '200px', backgroundColor: 'black', left: '50%', transform: 'translateX(-50%)' }} />
            <motion.div
              style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'black', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
              animate={{
                top: `${50 + (activeIndex / Math.max(1, categories.length - 1) - 0.5) * 100}%`,
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextCategory}
            className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
            style={{ fontFamily: "'Jersey 15'" }}
            aria-label="Next category"
          >
            <ChevronDown size={24} className="text-gray-900" />
          </motion.button>
        </div>

        {/* Grid Container with 3 Rows */}
        <div className="flex flex-col items-center justify-center gap-6 flex-1">
          {/* Top Row - Inactive */}
          {renderRow(topRowVideos, false)}

          {/* Active Row */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          >
            {renderRow(activeRowVideos, true)}
          </motion.div>

          {/* Bottom Row - Inactive */}
          {renderRow(bottomRowVideos, false)}
        </div>
      </div>

      {/* Horizontal Navigation - Video Carousel Controls */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevVideo}
          disabled={horizontalIndex === 0}
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: "'Jersey 15'" }}
          aria-label="Previous videos"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </motion.button>

        {/* Progress indicator */}
        <div className="flex items-center justify-center relative" style={{ width: '200px', height: '20px', position: 'relative' }}>
          <div style={{ position: 'absolute', width: '200px', height: '4px', backgroundColor: 'black', top: '50%', transform: 'translateY(-50%)' }} />
          <motion.div
            style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'black', position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)' }}
            animate={{
              left: `${50 + (horizontalIndex / Math.max(1, videos.length - VISIBLE_VIDEOS) - 0.5) * 100}%`,
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextVideo}
          disabled={startIdx + VISIBLE_VIDEOS >= videos.length}
          style={{ fontFamily: "'Jersey 15'" }}
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next videos"
        >
          <ChevronRight size={24} className="text-gray-900" />
        </motion.button>
      </div>
    </div>
  )
}
