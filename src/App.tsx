import { useState } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Available categories for the application */
const CATEGORIES = ['Partenaires', 'Culture', 'Clubs', 'Trésorie', 'Atelier']

// =============================================================================
// COMPONENT
// =============================================================================

function App() {
  const [activeCategory, setActiveCategory] = useState('Clubs')

  // Map categories to sidebar items
  const sidebarItems = CATEGORIES.map((category) => ({
    id: category,
    label: category,
    disabled: false,
  }))

  return (
    <div className="h-screen bg-white overflow-hidden relative">
      <Header />

      <Sidebar
        items={sidebarItems}
        activeId={activeCategory}
        onSelect={setActiveCategory}
      />

      <CarouselGrid
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </div>
  )
}

export default App
