import React, { useEffect, useRef, useState, useCallback } from 'react'
import './PreloaderExperience.css'

// Put xyntra-preloader.mp4 in your /public folder
const VIDEO_SRC = '/videos/xyntra-preloader.mp4'

// How many seconds BEFORE the video ends the hero starts to fade in.
// The video's final frames dissolve into the hero, so there is never a hard cut.
const FADE_LEAD = 0.9

// Safety nets (ms)
const LOAD_TIMEOUT = 8000 // video never becomes playable -> skip preloader
const MAX_TOTAL = 20000 // absolute failsafe

export default function PreloaderExperience({ onReveal, onComplete }) {
  const videoRef = useRef(null)
  const revealedRef = useRef(false)
  const doneRef = useRef(false)
  const [revealing, setRevealing] = useState(false)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    document.documentElement.classList.remove('preloader-lock')
    onComplete && onComplete()
  }, [onComplete])

  const reveal = useCallback(() => {
    if (revealedRef.current) return
    revealedRef.current = true
    setRevealing(true) // starts CSS fade of the preloader
    onReveal && onReveal() // start hero entrance animations now
  }, [onReveal])

  // Lock scroll while preloader is visible
  useEffect(() => {
    document.documentElement.classList.add('preloader-lock')
    return () => document.documentElement.classList.remove('preloader-lock')
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Reduced-motion users: skip straight to the site
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal()
      const t = setTimeout(finish, 50)
      return () => clearTimeout(t)
    }

    let raf = 0
    let started = false

    const watch = () => {
      const d = video.duration
      if (d && isFinite(d)) {
        const remaining = (d - video.currentTime) / (video.playbackRate || 1)
        if (remaining <= FADE_LEAD) {
          reveal()
          return
        }
      }
      raf = requestAnimationFrame(watch)
    }

    const start = () => {
      if (started) return
      started = true
      clearTimeout(loadTimer)
      const p = video.play()
      if (p && p.catch) {
        p.catch(() => {
          // Autoplay blocked -> don't trap the user behind a frozen frame
          reveal()
          setTimeout(finish, 900)
        })
      }
      raf = requestAnimationFrame(watch)
    }

    const fail = () => {
      reveal()
      setTimeout(finish, 900)
    }

    // Only start once enough is buffered to play through without stalls
    const loadTimer = setTimeout(fail, LOAD_TIMEOUT)
    if (video.readyState >= 4) start()
    else video.addEventListener('canplaythrough', start, { once: true })

    video.addEventListener('ended', reveal) // fallback if rAF missed it
    video.addEventListener('error', fail)

    const failsafe = setTimeout(() => {
      reveal()
      setTimeout(finish, 900)
    }, MAX_TOTAL)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(loadTimer)
      clearTimeout(failsafe)
      video.removeEventListener('canplaythrough', start)
      video.removeEventListener('ended', reveal)
      video.removeEventListener('error', fail)
    }
  }, [reveal, finish])

  // Unmount only AFTER the fade has fully finished
  const handleTransitionEnd = (e) => {
    if (e.target === e.currentTarget && e.propertyName === 'opacity' && revealing) finish()
  }

  return (
    <div
      className={`video-preloader ${revealing ? 'is-revealing' : ''}`}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="video-preloader__video"
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
      />
    </div>
  )
}