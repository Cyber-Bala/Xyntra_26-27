import { useCallback, useEffect, useRef, useState } from 'react'
import './CinematicVideoBackground.css'

const VIDEO_SOURCE = '/videos/xyntra-atmosphere.mp4'
const CROSSFADE_SECONDS = 1.6

export default function CinematicVideoBackground({ isWarping = false }) {
  const videosRef = useRef([])
  const activeIndexRef = useRef(0)
  const isTransitioningRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const transitionTo = useCallback(async (nextIndex) => {
    if (isTransitioningRef.current) return
    const nextVideo = videosRef.current[nextIndex]
    if (!nextVideo) return

    isTransitioningRef.current = true
    nextVideo.currentTime = 0
    try {
      await nextVideo.play()
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
    } catch {
      isTransitioningRef.current = false
    }
  }, [])

  const handleTimeUpdate = (index) => {
    if (index !== activeIndexRef.current || isTransitioningRef.current) return
    const video = videosRef.current[index]
    if (!video || !Number.isFinite(video.duration)) return

    if (video.duration - video.currentTime <= CROSSFADE_SECONDS) {
      transitionTo(1 - index)
    }
  }

  const handleEnded = (index) => {
    const video = videosRef.current[index]
    if (!video) return

    if (index === activeIndexRef.current) {
      const incomingVideo = videosRef.current[1 - index]
      incomingVideo?.pause()
      if (incomingVideo) incomingVideo.currentTime = 0
      video.currentTime = 0
      video.play().catch(() => {})
      isTransitioningRef.current = false
      return
    }

    video.pause()
    video.currentTime = 0
    isTransitioningRef.current = false
  }

  useEffect(() => {
    const videos = videosRef.current
    const firstVideo = videos[0]
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!firstVideo) return undefined

    if (reduceMotion) {
      const holdFirstFrame = () => {
        firstVideo.pause()
        firstVideo.currentTime = 0
      }
      if (firstVideo.readyState >= 2) holdFirstFrame()
      else firstVideo.addEventListener('loadeddata', holdFirstFrame, { once: true })
      return () => firstVideo.removeEventListener('loadeddata', holdFirstFrame)
    }

    firstVideo.play().catch(() => {})
    return undefined
  }, [])

  return (
    <div className={`cinematic-background ${isWarping ? 'is-warping' : ''}`} aria-hidden="true">
      {[0, 1].map((index) => (
        <video
          key={index}
          ref={(element) => { videosRef.current[index] = element }}
          className={`cinematic-background-video ${activeIndex === index ? 'is-visible' : ''}`}
          src={VIDEO_SOURCE}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          onTimeUpdate={() => handleTimeUpdate(index)}
          onEnded={() => handleEnded(index)}
        />
      ))}
      <div className="cinematic-background-scrim" />
      <div className="cinematic-background-blue-haze" />
    </div>
  )
}
