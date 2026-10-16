import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import retroEarthTexture from '@/assets/images/retro_earth_texture.png'

export default function Globe() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 860x860 resolution for crisp high-DPI rendering at the full original size
    const canvasSize = 860
    canvas.width = canvasSize
    canvas.height = canvasSize

    let renderer = null
    let scene = null
    let camera = null
    let coreGeom = null
    let coreMat = null
    let earthGeometry = null
    let earthMaterial = null
    let texture = null
    let animationFrameId = null

    let useFallback2D = false

    const isWebGLSupported = () => {
      try {
        const testCanvas = document.createElement('canvas')
        return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')))
      } catch {
        return false
      }
    }

    if (!isWebGLSupported()) {
      useFallback2D = true
    } else {
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        })
        renderer.setSize(canvasSize, canvasSize, false)

      scene = new THREE.Scene()
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
      camera.position.z = 2.5

      const globeGroup = new THREE.Group()
      globeGroup.rotation.z = 11.5 * (Math.PI / 180)
      globeGroup.rotation.x = 22 * (Math.PI / 180)
      scene.add(globeGroup)

      coreGeom = new THREE.SphereGeometry(0.98, 32, 32)
      coreMat = new THREE.MeshBasicMaterial({ color: 0x072b4f })
      const coreSphere = new THREE.Mesh(coreGeom, coreMat)
      globeGroup.add(coreSphere)

      const textureLoader = new THREE.TextureLoader()
      texture = textureLoader.load(retroEarthTexture, (loadedTex) => {
        loadedTex.needsUpdate = true
        if (earthMaterial) earthMaterial.needsUpdate = true
      })
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      texture.magFilter = THREE.LinearFilter
      texture.minFilter = THREE.LinearMipmapLinearFilter

      earthGeometry = new THREE.SphereGeometry(0.99, 64, 64)
      earthMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false,
      })
      const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial)
      earthSphere.rotation.y = 4.88
      globeGroup.add(earthSphere)

      const animate = () => {
        earthSphere.rotation.y += 0.010
        renderer.render(scene, camera)
        animationFrameId = requestAnimationFrame(animate)
      }
      animate()
    } catch (e) {
      console.warn('WebGL unavailable in Globe, using smooth 2D fallback', e)
      useFallback2D = true
    }
    }

    if (useFallback2D) {
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = retroEarthTexture

      let xOffset = 0
      const center = canvasSize / 2
      const radius = canvasSize * 0.49

      const render2D = () => {
        ctx.clearRect(0, 0, canvasSize, canvasSize)
        ctx.save()

        // Clip to globe circle
        ctx.beginPath()
        ctx.arc(center, center, radius, 0, Math.PI * 2)
        ctx.fillStyle = '#072b4f'
        ctx.fill()
        ctx.clip()

        // Tilt axis
        ctx.translate(center, center)
        ctx.rotate(11.5 * (Math.PI / 180))
        ctx.translate(-center, -center)

        if (img.complete && img.naturalWidth > 0) {
          xOffset = (xOffset + 1.2) % img.naturalWidth
          const scale = (canvasSize * 1.1) / img.naturalHeight
          const drawW = img.naturalWidth * scale
          const drawH = img.naturalHeight * scale
          const drawY = center - drawH / 2

          // Wrap horizontally
          ctx.drawImage(img, -xOffset, drawY, drawW, drawH)
          ctx.drawImage(img, drawW - xOffset, drawY, drawW, drawH)
        }

        // 3D Spherical atmospheric shadow overlay
        const grad = ctx.createRadialGradient(
          center * 1.2, center * 0.7, radius * 0.2,
          center, center, radius
        )
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
        grad.addColorStop(0.7, 'rgba(0, 15, 35, 0.2)')
        grad.addColorStop(1, 'rgba(0, 5, 15, 0.85)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(center, center, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
        animationFrameId = requestAnimationFrame(render2D)
      }
      animationFrameId = requestAnimationFrame(render2D)
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (coreGeom) coreGeom.dispose()
      if (coreMat) coreMat.dispose()
      if (earthGeometry) earthGeometry.dispose()
      if (earthMaterial) earthMaterial.dispose()
      if (texture) texture.dispose()
      if (renderer) renderer.dispose()
    }
  }, [])

  return (
    <div className="tl-globe-wrapper" ref={containerRef} aria-hidden="true">
      <canvas ref={canvasRef} className="tl-globe-canvas" />
      <div className="tl-globe-rim" />
    </div>
  )
}
