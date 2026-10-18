import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import Reveal from './components/animations/Reveal.jsx'
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

  const smoothScrollTo = useCallback((target, offset = -70) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (typeof target === 'number') window.scrollTo(0, target)
      else target?.scrollIntoView()
      return
    }

    if (window.lenisInstance) {
      window.lenisInstance.scrollTo(target, {
        offset,
        duration: 1.45,
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
        force: true,
        lock: false,
      })
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' })
      } else {
        const top = (target?.getBoundingClientRect().top ?? 0) + window.scrollY + offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
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
    programmaticScrollTimer.current = setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 1200)

    const section = document.getElementById(targetId || page.section)
    const isHome = page.id === 1
    const destination = isHome ? 0 : section
    smoothScrollTo(destination, isHome ? 0 : -70)
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

    const sections = PAGES.filter((page) => page.section)
      .map((page) => ({ ...page, element: document.getElementById(page.section) }))
      .filter((page) => page.element)

    const updateActiveSection = () => {
      scrollFrame.current = 0
      if (isProgrammaticScroll.current) return
      const marker = window.innerHeight * 0.34
      const current = sections
        .filter((page) => page.element.getBoundingClientRect().top <= marker)
        .at(-1)
      const nextPage = current?.id ?? 1
      setActivePage((currentPage) => currentPage === nextPage ? currentPage : nextPage)
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
              <Reveal className="landing-section-reveal">
                <Hero onNavigate={handleNavigate} />
              </Reveal>
              <About />
              <Reveal className="landing-section-reveal about-timeline-reveal">
                <Timeline />
              </Reveal>
              <Reveal className="landing-section-reveal">
                <Prizes onNavigate={handleNavigate} />
              </Reveal>
              <Reveal className="landing-section-reveal">
                <Rules onNavigate={handleNavigate} />
              </Reveal>
              <Reveal className="landing-section-reveal">
                <Footer onNavigate={handleNavigate} />
              </Reveal>
            </>
          )}
        </main>
      </div>
    </>
  )
}
