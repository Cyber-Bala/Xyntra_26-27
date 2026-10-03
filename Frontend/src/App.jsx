import React, { useState, useEffect } from 'react'
import './App.css'
import SpaceBackground from './components/background/SpaceBackground.jsx'
import Navbar from './components/navbar/Navbar.jsx'
import PreloaderExperience from './components/preloader/PreloaderExperience.jsx'
import Hero from './components/pages/01_Hero/Hero.jsx'
import About from './components/pages/02_About/About.jsx'
import Rules from './components/pages/03_Rules/Rules.jsx'
import Register from './components/pages/04_Register/Register.jsx'
import Sponsors from './components/pages/05_Sponsors/Sponsors.jsx'

const PAGES = [
  { id: 1, label: 'Home' },
  { id: 2, label: 'About' },
  { id: 3, label: 'Rules' },
  { id: 4, label: 'Register' },
  { id: 5, label: 'Sponsors' },
]

export default function App() {
  const [activePage, setActivePage] = useState(1)
  const [introFinished, setIntroFinished] = useState(false)
  const [isWarping, setIsWarping] = useState(false)

  const handleIntroComplete = () => {
    setIsWarping(true)
    setTimeout(() => {
      setIntroFinished(true)
      setIsWarping(false)
    }, 600)
  }

  // Smooth scroll to top whenever page changes
  const handleNavigate = (pageId) => {
    setActivePage(pageId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Keyboard navigation: Left/Right arrow keys flip through pages
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!introFinished) return
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return

      if (e.key === 'ArrowRight' && activePage < 5) {
        handleNavigate(activePage + 1)
      } else if (e.key === 'ArrowLeft' && activePage > 1) {
        handleNavigate(activePage - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePage, introFinished])

  const currentPageObj = PAGES.find((p) => p.id === activePage) || PAGES[0]

  return (
    <div className="app-root-wrapper">
      
      {/* 🚀 CYBER PRELOADER / OPENING INTRO (IDEA 1: CYBER WARP GATE) */}
      {!introFinished && (
        <PreloaderExperience onComplete={handleIntroComplete} />
      )}

      {/* 🪐 LAYER 0: 3D AMBIENT SPACE BACKGROUND */}
      <SpaceBackground activePage={activePage} isWarping={isWarping} />

      {/* 🧭 LAYER 1: GLOBAL TOP NAVIGATION */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        pages={PAGES}
      />

      {/* 📄 LAYER 2: ACTIVE PAGE VIEW */}
      <main className="main-content-view">
        {activePage === 1 && <Hero onNavigate={handleNavigate} />}
        {activePage === 2 && <About onNavigate={handleNavigate} />}
        {activePage === 3 && <Rules onNavigate={handleNavigate} />}
        {activePage === 4 && <Register onNavigate={handleNavigate} />}
        {activePage === 5 && <Sponsors onNavigate={handleNavigate} />}
      </main>

      {/* 🎛️ LAYER 3: BOTTOM FLOATING HUD CONTROLLER */}
      <aside className="bottom-hud-bar" aria-label="Page Navigation Controls">
        <div className="hud-pagination-box">
          <button
            className="hud-nav-btn prev-btn"
            disabled={activePage === 1}
            onClick={() => handleNavigate(activePage - 1)}
            aria-label="Previous Page"
          >
            ← PREV
          </button>

          <div className="hud-page-indicator">
            <span className="hud-section-name">{currentPageObj.label}</span>
          </div>

          <button
            className="hud-nav-btn next-btn"
            disabled={activePage === 5}
            onClick={() => handleNavigate(activePage + 1)}
            aria-label="Next Page"
          >
            NEXT →
          </button>
        </div>
      </aside>

    </div>
  )
}