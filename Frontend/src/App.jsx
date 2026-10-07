import React, { useState, useEffect } from 'react'
import './App.css'
import SnowBackground from './components/background/SnowBackground.jsx'
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
  return (
    <div className="app-root-wrapper">

      {/* 🚀 CYBER PRELOADER / OPENING INTRO */}
      {!introFinished && (
        <PreloaderExperience onComplete={handleIntroComplete} />
      )}

      {/* ❄️ LAYER 0: PIXEL SNOW BACKGROUND */}
      <SnowBackground isWarping={isWarping} />

      {/* 🧭 LAYER 1: MINIMAL TOP NAVIGATION */}
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

    </div>
  );
}
