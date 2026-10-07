import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Reveal from './components/animations/Reveal.jsx'
import CinematicVideoBackground from './components/background/CinematicVideoBackground.jsx'
import Navbar from './components/navbar/Navbar.jsx'
import PreloaderExperience from './components/preloader/PreloaderExperience.jsx'
import Hero from './components/pages/01_Hero/Hero.jsx'
import About from './components/pages/02_About/About.jsx'
import Rules from './components/pages/03_Rules/Rules.jsx'
import Register from './components/pages/04_Register/Register.jsx'
import Sponsors from './components/pages/05_Sponsors/Sponsors.jsx'

const PAGES = [
  { id: 1, label: 'Home', section: 'hero' },
  { id: 2, label: 'About', section: 'about' },
  { id: 5, label: 'Sponsors', section: 'sponsors' },
  { id: 3, label: 'Rules', section: 'rules' },
  { id: 4, label: 'Register', path: '/register' },
]

function isRegistrationRoute(pathname) {
  return /^\/(?:register|payment\/|verify-email\/)/.test(pathname)
    || pathname.replace(/\/$/, '') === '/registration-status'
}

export default function App() {
  const [activePage, setActivePage] = useState(() => isRegistrationRoute(window.location.pathname) ? 4 : 1)
  const [introFinished, setIntroFinished] = useState(() => isRegistrationRoute(window.location.pathname))
  const [isWarping, setIsWarping] = useState(false)
  const isRegistrationPage = isRegistrationRoute(window.location.pathname)

  const handleIntroComplete = () => {
    setIsWarping(true)
    setTimeout(() => {
      setIntroFinished(true)
      setIsWarping(false)
    }, 600)
  }

  const handleNavigate = useCallback((pageId) => {
    const page = PAGES.find((item) => item.id === pageId)
    if (!page) return

    if (page.path) {
      if (isRegistrationRoute(window.location.pathname)) {
        setActivePage(page.id)
        if (window.lenisInstance) window.lenisInstance.scrollTo(0)
        else window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (window.location.pathname !== page.path) window.history.pushState({}, '', page.path)
      setActivePage(page.id)
      if (window.lenisInstance) window.lenisInstance.scrollTo(0)
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (isRegistrationRoute(window.location.pathname)) window.history.pushState({}, '', '/')
    setActivePage(page.id)
    requestAnimationFrame(() => {
      const section = document.getElementById(page.section)
      const destination = page.id === 1 ? 0 : section
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(destination, { offset: page.id === 1 ? 0 : -96 })
      }
      else if (page.id === 1) window.scrollTo({ top: 0, behavior: 'smooth' })
      else section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  // Keep the URL and rendered view in sync with browser back/forward navigation.
  useEffect(() => {
    const handlePopState = () => {
      const onRegistrationPage = isRegistrationRoute(window.location.pathname)
      setActivePage(onRegistrationPage ? 4 : 1)
      if (!onRegistrationPage) {
        if (window.lenisInstance) window.lenisInstance.scrollTo(0)
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Update the highlighted nav item as the landing page scrolls between sections.
  useEffect(() => {
    if (!introFinished || isRegistrationPage) return undefined

    const sections = PAGES.filter((page) => page.section)
      .map((page) => ({ ...page, element: document.getElementById(page.section) }))
      .filter((page) => page.element)

    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.34
      const current = sections
        .filter((page) => page.element.getBoundingClientRect().top <= marker)
        .at(-1)
      setActivePage(current?.id ?? 1)
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true })
    updateActiveSection()
    return () => window.removeEventListener('scroll', updateActiveSection)
  }, [introFinished, isRegistrationPage])

  return (
    <div className="app-root-wrapper">
      {!introFinished && <PreloaderExperience onComplete={handleIntroComplete} />}

      <CinematicVideoBackground isWarping={isWarping} />

      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        pages={PAGES}
      />

      <main className={`main-content-view ${isRegistrationPage ? 'registration-view' : 'landing-view'}`}>
        {isRegistrationPage ? (
          <Register onNavigate={handleNavigate} />
        ) : (
          <>
            <Reveal className="landing-section-reveal">
              <Hero onNavigate={handleNavigate} />
            </Reveal>
            <Reveal className="landing-section-reveal">
              <About onNavigate={handleNavigate} />
            </Reveal>
            <Reveal className="landing-section-reveal">
              <Sponsors onNavigate={handleNavigate} />
            </Reveal>
            <Reveal className="landing-section-reveal">
              <Rules onNavigate={handleNavigate} />
            </Reveal>
          </>
        )}
      </main>
    </div>
  );
}
