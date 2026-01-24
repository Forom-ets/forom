import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Share2 } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  channel: string;
}

interface VideoGridProps {
  videos: Video[];
}

export function VideoGrid({ videos }: VideoGridProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.02,
      transition: {
        type: 'spring' as const,
        damping: 10,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {videos.map((video) => (
        <motion.div
          key={video.id}
          variants={itemVariants}
          whileHover="hover"
          onHoverStart={() => setHoveredId(video.id)}
          onHoverEnd={() => setHoveredId(null)}
          className="group cursor-pointer"
        >
          <motion.div
            variants={hoverVariants}
            className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg"
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video bg-gray-300 overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === video.id ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(isPlaying === video.id ? null : video.id)}
                  className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                >
                  {isPlaying === video.id ? (
                    <Pause size={24} fill="white" />
                  ) : (
                    <Play size={24} fill="white" />
                  )}
                </motion.button>
              </motion.div>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>

            {/* Video info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>

              <p className="text-sm text-gray-600 mb-1">{video.channel}</p>
              <p className="text-xs text-gray-500">{video.views} views</p>

              {/* Action buttons */}
              {hoveredId === video.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2 mt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Volume2 size={16} />
                    <span>Mute</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}