import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import Reveal from './components/animations/Reveal.jsx'
import Navbar from './components/navbar/Navbar.jsx'
import Hero from './components/pages/01_Hero/Hero.jsx'
import About from './components/pages/02_About/About.jsx'
import Prizes from './components/pages/06_Prizes/Prizes.jsx'
import Evolution from './components/pages/01b_Evolution/Evolution.jsx'
import ParticleHeadings from './components/fx/ParticleHeadings.jsx'
import { CrtOverlay, Embers } from './components/fx/Atmosphere.jsx'
import Rules from './components/pages/03_Rules/Rules.jsx'
import Register from './components/pages/04_Register/Register.jsx'
import Footer from './components/footer/Footer.jsx'

const PAGES = [
  { id: 1, label: 'Home', section: 'hero' },
  { id: 2, label: 'About', section: 'about' },
  { id: 6, label: 'Prizes & Partners', section: 'prizes' },
  { id: 3, label: 'Rules', section: 'rules' },
  { id: 4, label: 'Register', path: '/register' },
]

function isRegistrationRoute(pathname) {
  return /^\/(?:register|payment\/|verify-email\/)/.test(pathname)
    || pathname.replace(/\/$/, '') === '/registration-status'
}

export default function App() {
  const scrollFrame = useRef(0)
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const [activePage, setActivePage] = useState(() => isRegistrationRoute(window.location.pathname) ? 4 : 1)
  const isRegistrationPage = activePage === 4 || isRegistrationRoute(currentPath) || isRegistrationRoute(window.location.pathname)

  const navigateImmediately = useCallback((pageId, targetId) => {
    // Cancel any pending scroll spy frame immediately
    if (scrollFrame.current) {
      window.cancelAnimationFrame(scrollFrame.current)
      scrollFrame.current = 0
    }

    const page = PAGES.find((item) => item.id === pageId)
    if (!page) {
      if (targetId) {
        const section = document.getElementById(targetId)
        if (section) {
          if (window.lenisInstance) window.lenisInstance.scrollTo(section, { offset: -96 })
          else section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
      return
    }

    if (page.path) {
      if (window.location.pathname !== page.path) {
        window.history.pushState({}, '', page.path)
      }
      setCurrentPath(page.path)
      setActivePage(page.id)
      window.scrollTo(0, 0)
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { immediate: true })
      }
      return
    }

    if (isRegistrationRoute(window.location.pathname)) {
      window.history.pushState({}, '', '/')
      setCurrentPath('/')
    }
    setActivePage(page.id)
    requestAnimationFrame(() => {
      const section = document.getElementById(targetId || page.section)
      const destination = page.id === 1 ? 0 : section
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(destination, { offset: page.id === 1 ? 0 : -96 })
      }
      else if (page.id === 1) window.scrollTo({ top: 0, behavior: 'smooth' })
      else section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const handleNavigate = useCallback((pageId, targetId) => {
    navigateImmediately(pageId, targetId)
  }, [navigateImmediately])

  // Keep the URL and rendered view in sync with browser back/forward navigation.
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      setCurrentPath(path)
      const onRegistrationPage = isRegistrationRoute(path)
      setActivePage(onRegistrationPage ? 4 : 1)
      window.scrollTo(0, 0)
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { immediate: true })
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Update the highlighted nav item as the landing page scrolls between sections.
  useEffect(() => {
    if (isRegistrationPage) return undefined

    const sections = PAGES.filter((page) => page.section)
      .map((page) => ({ ...page, element: document.getElementById(page.section) }))
      .filter((page) => page.element)

    const updateActiveSection = () => {
      scrollFrame.current = 0
      if (isRegistrationRoute(window.location.pathname)) return

      const marker = window.innerHeight * 0.34
      const current = sections
        .filter((page) => page.element.getBoundingClientRect().top <= marker)
        .at(-1)
      const nextPage = current?.id ?? 1
      setActivePage((currentPage) => {
        if (currentPage === 4) return 4
        return currentPage === nextPage ? currentPage : nextPage
      })
    }

    const scheduleActiveSectionUpdate = () => {
      if (scrollFrame.current) return
      scrollFrame.current = window.requestAnimationFrame(updateActiveSection)
    }

    window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true })
    updateActiveSection()
    return () => {
      window.removeEventListener('scroll', scheduleActiveSectionUpdate)
      if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current)
    }
  }, [isRegistrationPage])

  return (
    <>
      <Embers />
      <CrtOverlay />
      <ParticleHeadings />
      <div className="app-root-wrapper">
        {!isRegistrationPage && (
          <Navbar
            activePage={activePage}
            onNavigate={handleNavigate}
            pages={PAGES}
          />
        )}

        <main className={`main-content-view ${isRegistrationPage ? 'registration-view' : 'landing-view'}`}>
          {isRegistrationPage ? (
            <Register onNavigate={handleNavigate} />
          ) : (
            <>
              <Reveal className="landing-section-reveal">
                <Hero onNavigate={handleNavigate} />
              </Reveal>
              <Evolution onNavigate={handleNavigate} />
              <Reveal className="landing-section-reveal">
                <About />
              </Reveal>
              <Reveal className="landing-section-reveal">
                <Prizes onNavigate={handleNavigate} />
              </Reveal>
              <Reveal className="landing-section-reveal">
                <Rules onNavigate={handleNavigate} />
              </Reveal>
              <Footer onNavigate={handleNavigate} />
            </>
          )}
        </main>
      </div>
    </>
  )
}
