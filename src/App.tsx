import { useState } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'
import { mockVideos } from './data/mockVideos'

function App() {
  const [activeCategory, setActiveCategory] = useState('Clubs')

  // Available categories for the application
  const categories = ['Partenaires', 'Culture', 'Clubs', 'Trésorie', 'Atelier']

  // Map categories to sidebar items - all are selectable now
  const sidebarItems = categories.map((cat) => ({
    id: cat,
    label: cat,
    disabled: false,
  }))

  return (
    <div className="h-screen bg-white overflow-hidden relative">
      <Header />

      {/* Sidebar - positioned fixed on left */}
      <Sidebar
        items={sidebarItems}
        activeId={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Grid - will center itself absolutely */}
      <CarouselGrid
        videos={mockVideos}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </div>
  )
}

export default App
