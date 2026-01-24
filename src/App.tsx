import { useState } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'
import { mockVideos } from './data/mockVideos'

function App() {
  const [activeCategory, setActiveCategory] = useState('Clubs')

  // Available categories for the application
  const categories = ['Partenaires', 'Culture', 'Clubs', 'Trésorerie', 'Atelier']

  // Map categories to sidebar items with enablement logic
  const sidebarItems = categories.map((cat) => ({
    id: cat,
    label: cat,
    // Only 'Clubs' and 'Culture' are enabled in this demo
    disabled: cat !== 'Clubs' && cat !== 'Culture',
  }))

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          items={sidebarItems}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />

        <CarouselGrid
          videos={mockVideos}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
    </div>
  )
}

export default App
