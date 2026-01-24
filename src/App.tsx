import { useState } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CarouselGrid } from './components/CarouselGrid'
import { mockVideos } from './data/mockVideos'
import './App.css'

function App() {
  const [activeCategory, setActiveCategory] = useState('Clubs')

  const categories = ['Partenaires', 'Culture', 'Clubs', 'Trésorerie', 'Atelier']

  const sidebarItems = categories.map((cat) => ({
    id: cat,
    label: cat,
    disabled: cat !== 'Clubs' && cat !== 'Culture',
  }))

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          items={sidebarItems}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* Carousel Grid */}
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
