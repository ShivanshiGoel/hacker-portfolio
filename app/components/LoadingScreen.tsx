"use client"

import { useState, useEffect, useRef } from "react"
import { Terminal, Brain } from "lucide-react"

interface Star {
  x: number
  y: number
  z: number
  size: number
  brightness: number
  speed: number
}

interface GalaxyArm {
  angle: number
  radius: number
  stars: Star[]
}

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const galaxyRotation = useRef(0)
  const [backgroundStars, setBackgroundStars] = useState<Star[]>([])

  const loadingSteps = [
    "> INITIALIZING COSMIC SYSTEMS...",
    "> LOADING NEURAL PATHWAYS...",
    "> CONNECTING TO UNIVERSAL GRID...",
    "> CALIBRATING QUANTUM PROCESSORS...",
    "> MOUNTING CONSCIOUSNESS FILESYSTEM...",
    "> ESTABLISHING DIMENSIONAL LINKS...",
    "> SYNCHRONIZING REALITY MATRICES...",
    "> ACTIVATING GALAXY BRAIN PROTOCOL...",
    "> READY TO LAUNCH.",
  ]

  // Initialize background stars
  useEffect(() => {
    const stars: Star[] = []
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        speed: Math.random() * 0.5 + 0.1,
      })
    }
    setBackgroundStars(stars)
  }, [])

  // Typewriter effect for loading text
  useEffect(() => {
    if (currentStep >= loadingSteps.length) {
      setIsComplete(true)
      return
    }

    const currentText = loadingSteps[currentStep]
    let charIndex = 0
    setDisplayText("")

    const typeInterval = setInterval(() => {
      if (charIndex < currentText.length) {
        setDisplayText(currentText.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1)
        }, 300)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [currentStep])

  // Galaxy animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create galaxy arms
    const galaxyArms: GalaxyArm[] = []
    const numArms = 4
    const starsPerArm = 80

    for (let arm = 0; arm < numArms; arm++) {
      const armAngle = (arm * Math.PI * 2) / numArms
      const armStars: Star[] = []

      for (let i = 0; i < starsPerArm; i++) {
        const t = i / starsPerArm
        const radius = 50 + t * 300
        const angle = armAngle + t * Math.PI * 1.5
        const spiralX = Math.cos(angle) * radius
        const spiralY = Math.sin(angle) * radius

        armStars.push({
          x: spiralX,
          y: spiralY,
          z: Math.random() * 100,
          size: Math.random() * 3 + 1,
          brightness: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.02 + 0.01,
        })
      }

      galaxyArms.push({
        angle: armAngle,
        radius: 300,
        stars: armStars,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background stars with parallax
      backgroundStars.forEach((star) => {
        const parallaxFactor = star.z / 1000
        const x = star.x + Math.sin(galaxyRotation.current * 0.1) * parallaxFactor * 20
        const y = star.y + Math.cos(galaxyRotation.current * 0.1) * parallaxFactor * 10

        ctx.beginPath()
        ctx.arc(x, y, star.size * (1 - parallaxFactor * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * (1 - parallaxFactor * 0.3)})`
        ctx.fill()

        // Twinkling effect
        if (Math.random() > 0.99) {
          ctx.beginPath()
          ctx.arc(x, y, star.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(79, 193, 255, ${star.brightness * 0.5})`
          ctx.fill()
        }
      })

      // Draw galaxy center
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Galaxy core glow
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)
      coreGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
      coreGradient.addColorStop(0.3, "rgba(79, 193, 255, 0.6)")
      coreGradient.addColorStop(0.6, "rgba(138, 43, 226, 0.4)")
      coreGradient.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2)
      ctx.fillStyle = coreGradient
      ctx.fill()

      // Draw galaxy arms
      galaxyArms.forEach((arm) => {
        arm.stars.forEach((star) => {
          const rotatedX = star.x * Math.cos(galaxyRotation.current) - star.y * Math.sin(galaxyRotation.current)
          const rotatedY = star.x * Math.sin(galaxyRotation.current) + star.y * Math.cos(galaxyRotation.current)

          const screenX = centerX + rotatedX
          const screenY = centerY + rotatedY

          // Only draw stars within screen bounds
          if (screenX >= -50 && screenX <= canvas.width + 50 && screenY >= -50 && screenY <= canvas.height + 50) {
            ctx.beginPath()
            ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`
            ctx.fill()

            // Add colored glow for some stars
            if (star.brightness > 0.7) {
              ctx.beginPath()
              ctx.arc(screenX, screenY, star.size * 3, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(79, 193, 255, ${star.brightness * 0.3})`
              ctx.fill()
            }
          }
        })
      })

      // Draw nebula effects
      const nebulaGradient = ctx.createRadialGradient(centerX - 100, centerY + 50, 0, centerX - 100, centerY + 50, 200)
      nebulaGradient.addColorStop(0, "rgba(138, 43, 226, 0.2)")
      nebulaGradient.addColorStop(0.5, "rgba(75, 0, 130, 0.1)")
      nebulaGradient.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(centerX - 100, centerY + 50, 150, 0, Math.PI * 2)
      ctx.fillStyle = nebulaGradient
      ctx.fill()

      galaxyRotation.current += 0.005

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [backgroundStars])

  return (
    <div className="fixed inset-0 bg-black text-white font-mono flex items-center justify-center z-[100] overflow-hidden">
      {/* Galaxy Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-blue-900/20 pointer-events-none" />

      {/* Loading Content */}
      <div className="relative z-10 max-w-4xl w-full p-8">
        <div className="glass-terminal p-12 border-2 border-[#4FC1FF]/30 mx-auto max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-center mb-12">
            <Brain className="w-12 h-12 mr-4 text-[#4FC1FF] animate-pulse" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4FC1FF] to-[#C586C0]">
              GALAXY BRAIN TERMINAL
            </h1>
          </div>

          {/* Loading Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#6A9955] text-sm">// Initialization Progress</span>
              <span className="text-[#DCDCAA] text-sm">{Math.round((currentStep / loadingSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#4FC1FF] to-[#4EC9B0] h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / loadingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Terminal Output */}
          <div className="space-y-3 mb-8 min-h-[200px]">
            {loadingSteps.slice(0, currentStep).map((step, index) => (
              <div key={index} className="flex items-center text-[#4EC9B0] text-lg">
                <Terminal className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="font-mono">{step}</span>
                <span className="ml-2 text-[#4FC1FF]">✓</span>
              </div>
            ))}
            {currentStep < loadingSteps.length && (
              <div className="flex items-center text-[#4EC9B0] text-lg">
                <Terminal className="w-4 h-4 mr-3 flex-shrink-0 animate-pulse" />
                <span className="font-mono">{displayText}</span>
                <span className="ml-2 w-3 h-6 bg-[#4FC1FF] animate-pulse"></span>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#4EC9B0] rounded-full animate-pulse mr-2"></div>
                <span className="text-[#C586C0]">Cosmic Status:</span>
              </div>
              <span className="text-[#4FC1FF] animate-pulse">{isComplete ? "TRANSCENDENT" : "INITIALIZING"}</span>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center mt-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#4FC1FF]/20 border-t-[#4FC1FF] rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-8 h-8 border-2 border-[#C586C0]/20 border-t-[#C586C0] rounded-full animate-spin animation-reverse"></div>
          </div>
        </div>
      </div>

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none scan-lines opacity-10" />
    </div>
  )
}
