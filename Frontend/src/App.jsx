import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import Navbar from './components/navbar/Navbar.jsx'
import Hero from './components/pages/01_Hero/Hero.jsx'
import About from './components/pages/02_About/About.jsx'
import Prizes from './components/pages/06_Prizes/Prizes.jsx'
import { CrtOverlay } from './components/fx/Atmosphere.jsx'
import Rules from './components/pages/03_Rules/Rules.jsx'
import Register from './components/pages/04_Register/Register.jsx'
import Footer from './components/footer/Footer.jsx'
import Timeline from './components/pages/05_Timeline/Timeline.jsx'
import PixelTransition from './components/fx/PixelTransition.jsx'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  const [currentRoute, setCurrentRoute] = useState(() => window.location.pathname)
  const [activePage, setActivePage] = useState(() => isRegistrationRoute(window.location.pathname) ? 4 : 1)
  const isRegistrationPage = isRegistrationRoute(currentRoute)

  const isProgrammaticScroll = useRef(false)
  const programmaticScrollTimer = useRef(null)

  const smoothScrollTo = useCallback((target, offset = 0, onDone) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (typeof target === 'number') window.scrollTo(0, target)
      else target?.scrollIntoView()
      onDone?.()
      return
    }

    const currentY = window.pageYOffset || 0
    let targetY = currentY
    if (typeof target === 'number') {
      targetY = target
    } else if (target) {
      targetY = (target.getBoundingClientRect?.().top ?? 0) + currentY + offset
    }
    const dist = Math.abs(targetY - currentY)
    // Scale duration proportionally so longer travel distances remain smooth, controlled, and never violent
    const duration = dist > 3500 ? 1.9 : dist > 1800 ? 1.6 : 1.25

    if (window.lenisInstance) {
      window.lenisInstance.scrollTo(target, {
        offset,
        duration,
        easing: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
        force: true,
        lock: false,
        onComplete: onDone,
      })
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' })
      }
      if (onDone) setTimeout(onDone, Math.round(duration * 1000) + 50)
    }
  }, [])

  const navigateImmediately = useCallback((pageId, targetId) => {
    const page = PAGES.find((item) => item.id === pageId)
    const currentlyOnRegister = isRegistrationRoute(window.location.pathname)

    if (!page) {
      if (targetId) {
        const section = document.getElementById(targetId)
        if (section) {
          smoothScrollTo(section, -70)
        }
      }
      return
    }

    // Navigating to Register
    if (page.path === '/register') {
      window.history.pushState({}, '', '/register')
      setCurrentRoute('/register')
      setActivePage(4)
      window.scrollTo(0, 0)
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { immediate: true })
      }
      return
    }

    // Navigating back to Home/landing from Register
    if (currentlyOnRegister) {
      window.history.pushState({}, '', '/')
      setCurrentRoute('/')
      setActivePage(page.id)

      // Snap scroll immediately to top with ZERO animation while under the transition
      window.scrollTo(0, 0)
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { immediate: true })
      }

      // If a non-hero target was requested (e.g., #about, #prizes), scroll to it after landing mounts
      if (targetId && targetId !== 'hero') {
        setTimeout(() => {
          const sec = document.getElementById(targetId)
          if (sec) smoothScrollTo(sec, -70)
        }, 100)
      }

      requestAnimationFrame(() => {
        window.scrollTo(0, 0)
        if (window.lenisInstance) {
          window.lenisInstance.scrollTo(0, { immediate: true })
        }
        ScrollTrigger.refresh()
      })
      return
    }

    // Standard in-page smooth navigation on the landing page
    setActivePage(page.id)
    isProgrammaticScroll.current = true
    if (programmaticScrollTimer.current) clearTimeout(programmaticScrollTimer.current)

    const resetProgrammatic = () => {
      isProgrammaticScroll.current = false
      if (programmaticScrollTimer.current) {
        clearTimeout(programmaticScrollTimer.current)
        programmaticScrollTimer.current = null
      }
    }
    programmaticScrollTimer.current = setTimeout(resetProgrammatic, 2100)

    const section = document.getElementById(targetId || page.section)
    const isHome = page.id === 1
    const destination = isHome ? 0 : section
    const offset = (isHome || page.id === 6 || page.id === 3) ? 0 : -20
    smoothScrollTo(destination, offset, resetProgrammatic)
  }, [smoothScrollTo])

  const [pixelTransitionActive, setPixelTransitionActive] = useState(false)
  const pendingNavigationAction = useRef(null)

  const handleNavigate = useCallback((pageId, targetId) => {
    if (pixelTransitionActive) return

    const page = PAGES.find((item) => item.id === pageId)
    const currentlyOnRegister = isRegistrationRoute(window.location.pathname)

    const isTargetRegister =
      page?.path === '/register' ||
      targetId === 'register' ||
      targetId === '/register' ||
      pageId === 4

    const isMovingToRegister = isTargetRegister && !currentlyOnRegister
    const isMovingBackToHome = currentlyOnRegister && (pageId === 1 || page?.section || targetId === 'hero')

    // Apply the single pixel transition when moving to Register OR when clicking back to Home from Register
    if (isMovingToRegister || isMovingBackToHome) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        navigateImmediately(pageId, targetId)
        return
      }
      pendingNavigationAction.current = () => navigateImmediately(pageId, targetId)
      setPixelTransitionActive(true)
      return
    }

    navigateImmediately(pageId, targetId)
  }, [navigateImmediately, pixelTransitionActive])

  const handleTransitionMidpoint = useCallback(() => {
    if (pendingNavigationAction.current) {
      pendingNavigationAction.current()
      pendingNavigationAction.current = null
    }
  }, [])

  const handleTransitionComplete = useCallback(() => {
    setPixelTransitionActive(false)
    pendingNavigationAction.current = null
  }, [])

  // Keep the URL and rendered view in sync with browser back/forward navigation.
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      const onRegistrationPage = isRegistrationRoute(path)
      setCurrentRoute(path)
      setActivePage(onRegistrationPage ? 4 : 1)
      if (!onRegistrationPage) {
        window.scrollTo(0, 0)
        if (window.lenisInstance) {
          window.lenisInstance.scrollTo(0, { immediate: true })
        }
        ScrollTrigger.refresh()
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Update the highlighted nav item as the landing page scrolls between sections.
  useEffect(() => {
    if (isRegistrationPage) return undefined

    const pageTargets = PAGES.filter((page) => page.section)

    let offsets = []
    const cacheOffsets = () => {
      offsets = pageTargets
        .map((p) => {
          const el = document.getElementById(p.section)
          return el ? { id: p.id, top: el.offsetTop } : null
        })
        .filter(Boolean)
        .sort((a, b) => a.top - b.top)
    }

    cacheOffsets()
    window.addEventListener('resize', cacheOffsets)
    window.addEventListener('load', cacheOffsets)

    let lastActive = 1
    const updateActiveSection = () => {
      scrollFrame.current = 0
      if (isProgrammaticScroll.current) return
      const sy = (window.pageYOffset || 0) + window.innerHeight * 0.34
      let next = 1
      for (let i = 0; i < offsets.length; i++) {
        if (sy >= offsets[i].top) {
          next = offsets[i].id
        }
      }
      if (next !== lastActive) {
        lastActive = next
        setActivePage(next)
      }
    }

    const scheduleActiveSectionUpdate = () => {
      if (scrollFrame.current) return
      scrollFrame.current = window.requestAnimationFrame(updateActiveSection)
    }

    window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true })
    updateActiveSection()
    return () => {
      window.removeEventListener('scroll', scheduleActiveSectionUpdate)
      window.removeEventListener('resize', cacheOffsets)
      window.removeEventListener('load', cacheOffsets)
      if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current)
    }
  }, [isRegistrationPage])

  return (
    <>
      <PixelTransition
        isActive={pixelTransitionActive}
        onMidpoint={handleTransitionMidpoint}
        onComplete={handleTransitionComplete}
      />
      {isRegistrationPage && (
        <CrtOverlay />
      )}
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
              <Hero onNavigate={handleNavigate} />
              <About />
              <Timeline />
              <Prizes onNavigate={handleNavigate} />
              <Rules onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </>
          )}
        </main>
      </div>
    </>
  )
}
