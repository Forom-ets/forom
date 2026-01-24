/**
 * Video data type definition
 */
export interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  views: string
  channel: string
}

/**
 * Mock video data for demonstration purposes
 * Contains 12 sample videos with various categories
 */
export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Beautiful Sunset Photography Tutorial',
    thumbnail:
      'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400&h=225&fit=crop',
    duration: '12:45',
    views: '1.2M',
    channel: 'Creative Academy',
  },
  {
    id: '2',
    title: 'React Performance Optimization Guide',
    thumbnail:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop',
    duration: '18:30',
    views: '345K',
    channel: 'Web Dev Masters',
  },
  {
    id: '3',
    title: 'Urban Exploration Documentary',
    thumbnail:
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=225&fit=crop',
    duration: '24:15',
    views: '2.5M',
    channel: 'Adventure Films',
  },
  {
    id: '4',
    title: 'Cooking Perfect Pasta from Scratch',
    thumbnail:
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=225&fit=crop',
    duration: '8:20',
    views: '890K',
    channel: 'Culinary World',
  },
  {
    id: '5',
    title: 'Digital Art Creation Process',
    thumbnail:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=225&fit=crop',
    duration: '15:50',
    views: '567K',
    channel: 'Art Collective',
  },
  {
    id: '6',
    title: 'Mountain Hiking Adventure Vlog',
    thumbnail:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop',
    duration: '22:10',
    views: '1.8M',
    channel: 'Outdoor Life',
  },
  {
    id: '7',
    title: 'JavaScript ES2024 Features Explained',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=225&fit=crop',
    duration: '16:45',
    views: '423K',
    channel: 'Code Chronicles',
  },
  {
    id: '8',
    title: 'Ocean Waves Meditation Video',
    thumbnail:
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=225&fit=crop',
    duration: '30:00',
    views: '3.2M',
    channel: 'Zen Moments',
  },
  {
    id: '9',
    title: 'Home Organization Hacks',
    thumbnail:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop',
    duration: '11:30',
    views: '756K',
    channel: 'Home & Lifestyle',
  },
  {
    id: '10',
    title: 'Astrophotography Techniques',
    thumbnail:
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=225&fit=crop',
    duration: '19:20',
    views: '654K',
    channel: 'Sky Watchers',
  },
  {
    id: '11',
    title: 'Machine Learning Crash Course',
    thumbnail:
      'https://images.unsplash.com/photo-1515522141207-5c60dd7ce706?w=400&h=225&fit=crop',
    duration: '45:15',
    views: '512K',
    channel: 'AI Academy',
  },
  {
    id: '12',
    title: 'Street Photography Masterclass',
    thumbnail:
      'https://images.unsplash.com/photo-1533634701601-08a9c3daad97?w=400&h=225&fit=crop',
    duration: '21:40',
    views: '341K',
    channel: 'Photo Pro Tips',
  },
]