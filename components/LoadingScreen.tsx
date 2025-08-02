"use client"

import { useState, useEffect, useRef } from "react"
import { Brain, Terminal } from "lucide-react"

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

const HACKER_COMMANDS = [
  "sudo access neural_pathways --recursive",
  "chmod 777 /consciousness/core/*",
  "wget https://cosmic.api/quantum_data.json",
  "gcc -o reality reality.c -lquantum -lcosmic",
  "python3 neural_network_init.py --dimensions=infinite",
  "docker run -d --name galaxy_brain cosmic/consciousness:latest",
  "npm install @cosmic/brain-interface@latest",
  "git clone https://github.com/universe/consciousness.git",
  "make install PREFIX=/usr/local/cosmic",
  "systemctl enable quantum-entanglement.service",
  "pip install tensorflow-cosmic numpy-quantum",
  "cargo build --release --features=multidimensional",
  "go run main.go --mode=transcendent --debug=false",
  "rustc --edition=2024 cosmic_brain.rs -o reality.exe",
  "node server.js --port=∞ --host=0.0.0.0",
  "./configure --enable-consciousness --with-quantum-support",
  "tar -xzf universal_knowledge.tar.gz",
  "ssh root@galaxy-brain.cosmic 'systemctl start enlightenment'",
  "curl -X POST https://api.cosmos/v1/initialize -H 'Auth: Bearer ∞'",
  "find /reality -name '*.truth' -exec process {} \\;",
]

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)
  const [displayedCommands, setDisplayedCommands] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const galaxyRotation = useRef(0)
  const [backgroundStars, setBackgroundStars] = useState<Star[]>([])

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

  // Hacker command animation
  useEffect(() => {
    if (currentCommandIndex >= HACKER_COMMANDS.length) {
      setIsComplete(true)
      return
    }

    const command = HACKER_COMMANDS[currentCommandIndex]
    let charIndex = 0
    setCurrentCommand("")

    const typeInterval = setInterval(() => {
      if (charIndex < command.length) {
        setCurrentCommand(command.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        // Add completed command to history
        setDisplayedCommands((prev) => [...prev.slice(-5), `$ ${command}`, `✓ SUCCESS`])

        // Move to next command after a brief pause
        setTimeout(() => {
          setCurrentCommandIndex((prev) => prev + 1)
          setProgress((prev) => Math.min(100, prev + 100 / HACKER_COMMANDS.length))
        }, 200)
      }
    }, 30) // Fast typing

    return () => clearInterval(typeInterval)
  }, [currentCommandIndex])

  // Galaxy animation (same as before but optimized)
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
    const starsPerArm = 60 // Reduced for performance

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

      {/* Bordered Frame Container */}
      <div className="relative z-10 w-full h-full max-w-7xl max-h-[90vh] m-8">
        <div className="w-full h-full border-2 border-[#4FC1FF]/40 bg-black/80 backdrop-blur-sm relative">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#4FC1FF]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#4FC1FF]"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#4FC1FF]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#4FC1FF]"></div>

          {/* Content */}
          <div className="p-12 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-center mb-8">
              <Brain className="w-12 h-12 mr-4 text-[#4FC1FF] animate-pulse" />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4FC1FF] to-[#C586C0]">
                GALAXY BRAIN TERMINAL
              </h1>
            </div>

            {/* Progress Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#6A9955] text-sm">// Initialization Progress</span>
                <span className="text-[#DCDCAA] text-sm">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-[#4FC1FF]/30">
                <div
                  className="bg-gradient-to-r from-[#4FC1FF] to-[#4EC9B0] h-3 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Hacker Terminal Output */}
            <div className="flex-1 bg-black/60 border border-[#4FC1FF]/20 rounded p-4 font-mono text-sm overflow-hidden">
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {displayedCommands.map((line, index) => (
                  <div
                    key={index}
                    className={`${line.startsWith("$") ? "text-[#4FC1FF]" : line.startsWith("✓") ? "text-[#4EC9B0]" : "text-gray-300"} leading-relaxed`}
                  >
                    {line}
                  </div>
                ))}
                {!isComplete && (
                  <div className="flex items-center text-[#4FC1FF]">
                    <Terminal className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>$ {currentCommand}</span>
                    <span className="ml-2 w-2 h-5 bg-[#4FC1FF] animate-pulse"></span>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="text-center mt-6">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#4EC9B0] rounded-full animate-pulse mr-2"></div>
                  <span className="text-[#C586C0]">Cosmic Status:</span>
                </div>
                <span className="text-[#4FC1FF] animate-pulse">
                  {progress < 25
                    ? "INITIALIZING"
                    : progress < 50
                      ? "LOADING"
                      : progress < 75
                        ? "CONNECTING"
                        : progress < 100
                          ? "FINALIZING"
                          : "TRANSCENDENT"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none scan-lines opacity-10" />
    </div>
  )
}
