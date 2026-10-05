import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './SpaceBackground.css'

// Unified Strict Color Theme: HEX #0004EB (Royal Cobalt) & HEX #020411 (Midnight Obsidian)
const PALETTES = [
  { primary: 0x0004eb, secondary: 0xffffff, ambient: 0x020411, fogDensity: 0.0014, warpSpeed: 0.6 },
  { primary: 0x0004eb, secondary: 0x4f46e5, ambient: 0x020411, fogDensity: 0.0014, warpSpeed: 0.7 },
  { primary: 0x0004eb, secondary: 0x2563eb, ambient: 0x020411, fogDensity: 0.0015, warpSpeed: 0.5 },
  { primary: 0x0004eb, secondary: 0x3b82f6, ambient: 0x020411, fogDensity: 0.0014, warpSpeed: 0.6 },
  { primary: 0x0004eb, secondary: 0xffffff, ambient: 0x020411, fogDensity: 0.0013, warpSpeed: 0.8 },
]

export default function SpaceBackground({ activePage = 1, isWarping = false }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const targetColorRef = useRef({ primary: new THREE.Color(0x0004eb), secondary: new THREE.Color(0xffffff) })
  const targetSpeedRef = useRef(0.7)
  const warpMultiplierRef = useRef(1.0)

  // Update warp multiplier when isWarping triggers
  useEffect(() => {
    if (isWarping) {
      warpMultiplierRef.current = 6.0
      const timer = setTimeout(() => {
        warpMultiplierRef.current = 1.0
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [isWarping])

  // Update target palette when activePage changes
  useEffect(() => {
    const pageIndex = Math.min(Math.max(1, activePage), PALETTES.length - 1)
    const p = PALETTES[pageIndex]
    targetColorRef.current.primary.setHex(p.primary)
    targetColorRef.current.secondary.setHex(p.secondary)
    targetSpeedRef.current = p.warpSpeed
  }, [activePage])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.fog = new THREE.FogExp2(0x020411, 0.0015)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2500)
    camera.position.z = 1000

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // 1. STARFIELD PARTICLES (Foreground & Background Stars)
    const starCount = 2400
    const starGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(starCount * 3)
    const colors = new Float32Array(starCount * 3)
    const sizes = new Float32Array(starCount)

    const baseCol1 = new THREE.Color(0x0004eb) // Cobalt
    const baseCol2 = new THREE.Color(0xffffff) // Pure White
    const tempCol = new THREE.Color()

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 2800
      positions[i3 + 1] = (Math.random() - 0.5) * 2800
      positions[i3 + 2] = (Math.random() - 0.5) * 2800

      tempCol.lerpColors(baseCol1, baseCol2, Math.random() * 0.8)
      colors[i3] = tempCol.r
      colors[i3 + 1] = tempCol.g
      colors[i3 + 2] = tempCol.b

      sizes[i] = Math.random() * 2.8 + 0.8
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Canvas particle circular sprite
    const createStarTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      grad.addColorStop(0, 'rgba(255,255,255,1)')
      grad.addColorStop(0.3, 'rgba(200,225,255,0.8)')
      grad.addColorStop(0.7, 'rgba(0,4,235,0.3)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(16, 16, 16, 0, Math.PI * 2)
      ctx.fill()
      return new THREE.CanvasTexture(canvas)
    }

    const starMat = new THREE.PointsMaterial({
      size: 3.8,
      vertexColors: true,
      map: createStarTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // 2. 3D CYBER GRID / TOPOGRAPHIC TERRAIN (HEX #0004EB)
    const gridSegments = 40
    const gridGeo = new THREE.PlaneGeometry(3200, 3200, gridSegments, gridSegments)
    gridGeo.rotateX(-Math.PI / 2)
    gridGeo.translate(0, -500, -200)

    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x0004eb,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const gridMesh = new THREE.Mesh(gridGeo, gridMat)
    scene.add(gridMesh)

    // 3. GLOWING AMBIENT NEBULA PARTICLES
    const nebulaCount = 450
    const nebGeo = new THREE.BufferGeometry()
    const nebPos = new Float32Array(nebulaCount * 3)
    const nebColors = new Float32Array(nebulaCount * 3)

    for (let i = 0; i < nebulaCount; i++) {
      const i3 = i * 3
      nebPos[i3] = (Math.random() - 0.5) * 1800
      nebPos[i3 + 1] = (Math.random() - 0.5) * 1400
      nebPos[i3 + 2] = (Math.random() - 0.5) * 1600

      nebColors[i3] = 0.0
      nebColors[i3 + 1] = 0.2
      nebColors[i3 + 2] = 0.95
    }
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3))
    nebGeo.setAttribute('color', new THREE.BufferAttribute(nebColors, 3))

    const nebMat = new THREE.PointsMaterial({
      size: 9,
      vertexColors: true,
      map: createStarTexture(),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const nebula = new THREE.Points(nebGeo, nebMat)
    scene.add(nebula)

    // Mouse Tracking with Inertia
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.4
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.4
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Resize Handler
    const handleResize = () => {
      if (!renderer || !camera) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    let currentSpeed = 0.7
    let clock = new THREE.Clock()
    let animationFrameId

    const currentPrimary = new THREE.Color(0x0004eb)
    const currentGridCol = new THREE.Color(0x0004eb)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      camera.position.x = mouseX * 0.5
      camera.position.y = -mouseY * 0.5
      camera.lookAt(0, 0, 0)

      // Smooth color morphing
      currentPrimary.lerp(targetColorRef.current.primary, 0.04)
      currentSpeed += (targetSpeedRef.current - currentSpeed) * 0.04

      const activeVelocity = currentSpeed * warpMultiplierRef.current

      // Rotate stars and warp forward
      stars.rotation.y += 0.0006 * activeVelocity
      stars.rotation.x += 0.0003 * activeVelocity
      nebula.rotation.y -= 0.0004 * activeVelocity

      // Move star positions for warp effect
      const starPosArr = starGeo.attributes.position.array
      for (let i = 2; i < starCount * 3; i += 3) {
        starPosArr[i] += 2.0 * activeVelocity
        if (starPosArr[i] > 1100) {
          starPosArr[i] = -1200
        }
      }
      starGeo.attributes.position.needsUpdate = true

      // Animate Grid terrain waves
      const gridPosArr = gridGeo.attributes.position.array
      for (let i = 0; i < gridPosArr.length; i += 3) {
        const x = gridPosArr[i]
        const z = gridPosArr[i + 2]
        gridPosArr[i + 1] = Math.sin(x * 0.003 + time * 1.2) * 22 + Math.cos(z * 0.003 + time * 0.8) * 22
      }
      gridGeo.attributes.position.needsUpdate = true

      // Update grid color
      currentGridCol.lerp(targetColorRef.current.primary, 0.02)
      gridMat.color.copy(currentGridCol)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div className="space-bg-wrapper" aria-hidden="true">
      <div ref={mountRef} className="three-canvas-container" />
      <div className="space-vignette-overlay" />
      <div className="space-ambient-glow" />
    </div>
  )
}
