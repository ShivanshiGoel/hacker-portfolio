"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  Terminal,
  Code,
  User,
  Mail,
  Zap,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  Github,
  ExternalLink,
  Volume2,
  VolumeX,
} from "lucide-react"
import { GitBranch, Moon } from "lucide-react"
import LoadingScreen from "./components/LoadingScreen"

type BrainRoom =
  | "boot"
  | "welcome"
  | "prefrontal-cortex"
  | "temporal-lobe"
  | "limbic-system"
  | "motor-cortex"
  | "synapse"

interface MousePosition {
  x: number
  y: number
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

interface CursorParticle {
  id: number
  x: number
  y: number
  life: number
  color: string
  size: number
}

interface Star {
  x: number
  y: number
  z: number
  size: number
  brightness: number
  twinkle: number
}

interface BlackHole {
  x: number
  y: number
  radius: number
  rotation: number
  intensity: number
}

interface TerminalTab {
  id: string
  title: string
  path: string
  content: React.ReactNode
  isActive: boolean
}

interface Command {
  input: string
  output: string | React.ReactNode
  timestamp: string
}

interface GalaxyArm {
  angle: number
  radius: number
  stars: Star[]
}

const BRAIN_SECTIONS = {
  neocortex: {
    title: "Neocortex",
    description: "Higher-order thinking • Projects & Code",
    color: "text-blue-300",
    icon: Brain,
  },
  "dream-cache": {
    title: "Dream Cache",
    description: "Subconscious processing • Ideas & Inspiration",
    color: "text-purple-300",
    icon: Moon,
  },
  chaos: {
    title: "Organized Chaos",
    description: "Creative entropy • Experiments & Prototypes",
    color: "text-yellow-300",
    icon: Zap,
  },
  "memory-bank": {
    title: "Memory Bank",
    description: "Experience storage • Skills & Learning",
    color: "text-green-300",
    icon: Activity,
  },
  "neural-net": {
    title: "Neural Network",
    description: "Connection patterns • Social & Collaboration",
    color: "text-cyan-300",
    icon: GitBranch,
  },
}

export default function DigitalMindPalace() {
  const [isLoading, setIsLoading] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<BrainRoom>("boot")
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [cursorParticles, setCursorParticles] = useState<CursorParticle[]>([])
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [bootComplete, setBootComplete] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [stars, setStars] = useState<Star[]>([])
  const [blackHole, setBlackHole] = useState<BlackHole>({ x: 0, y: 0, radius: 200, rotation: 0, intensity: 0.3 })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const ambientSoundRef = useRef<OscillatorNode | null>(null)

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create ambient cosmic sound
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(40, audioContextRef.current.currentTime)
      gainNode.gain.setValueAtTime(0.02, audioContextRef.current.currentTime)

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.start()
      ambientSoundRef.current = oscillator
    }
  }, [])

  // Play sound effect
  const playSound = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (!audioEnabled || !audioContextRef.current) return

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + duration)
    },
    [audioEnabled],
  )

  // Initialize stars
  useEffect(() => {
    const newStars: Star[] = []
    for (let i = 0; i < 200; i++) {
      newStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        twinkle: Math.random() * Math.PI * 2,
      })
    }
    setStars(newStars)
  }, [])

  // Mouse tracking with smooth interpolation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Create cursor particles
      if (Math.random() > 0.7) {
        const newParticle: CursorParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          life: 1,
          color: ["#22c55e", "#8b5cf6", "#3b82f6", "#ec4899"][Math.floor(Math.random() * 4)],
          size: Math.random() * 3 + 1,
        }
        setCursorParticles((prev) => [...prev.slice(-15), newParticle])
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animate cursor particles
  useEffect(() => {
    const animate = () => {
      setCursorParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            life: particle.life - 0.02,
            size: particle.size * 0.98,
          }))
          .filter((particle) => particle.life > 0),
      )
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [])

  // Particle system for neural sparks
  useEffect(() => {
    const interval = setInterval(() => {
      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        color: ["#22c55e", "#8b5cf6", "#3b82f6", "#ec4899", "#ef4444"][Math.floor(Math.random() * 5)],
        size: Math.random() * 2 + 1,
      }
      setParticles((prev) => [...prev.slice(-30), newParticle])
    }, 300)

    return () => clearInterval(interval)
  }, [])

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.008,
            size: particle.size * 0.995,
          }))
          .filter((particle) => particle.life > 0),
      )
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [])

  // Update black hole rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setBlackHole((prev) => ({
        ...prev,
        rotation: prev.rotation + 0.01,
        x: window.innerWidth / 2 + Math.sin(Date.now() * 0.0005) * 100,
        y: window.innerHeight / 2 + Math.cos(Date.now() * 0.0003) * 50,
      }))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Loading completion effect - faster
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Show terminal after a brief delay
      setTimeout(() => setShowTerminal(true), 500)
    }, 1500) // Changed from 2500 to 1500 - 1.5 seconds total loading time

    return () => clearTimeout(timer)
  }, [])

  const navigateToRoom = (room: BrainRoom) => {
    if (room === "boot") return

    setCurrentRoom(room)
    setTerminalHistory((prev) => [...prev, `cd /${room.replace("-", "_")}`, `Accessing ${room} neural pathway...`])
    playSound(800 + Math.random() * 400, 0.2, "square")
  }

  const handleTerminalCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    let response = ""

    // Play typing sound
    playSound(1200, 0.1, "square")

    switch (cmd) {
      case "ls":
        response = "prefrontal-cortex/  temporal-lobe/  limbic-system/  motor-cortex/  synapse/  consciousness/"
        break
      case "sudo dream":
        response = "🌙 Entering REM sleep mode... Dreams loading... Reality.exe suspended"
        playSound(300, 1, "sine")
        break
      case "cd consciousness":
        response = "Permission denied. Consciousness is still being compiled by the universe"
        playSound(150, 0.5, "sawtooth")
        break
      case "rm -rf sleep":
        response = "⚠️  Warning: Removing sleep will cause system instability. Coffee levels critical!"
        playSound(200, 0.3, "triangle")
        break
      case "whoami":
        response = "shivanshi@mindpalace:~$ Digital architect, code poet, neural network navigator"
        break
      case "enable audio":
        setAudioEnabled(true)
        initAudio()
        response = "🔊 Audio systems online. Cosmic frequencies activated."
        break
      case "disable audio":
        setAudioEnabled(false)
        response = "🔇 Audio systems offline. Silence in the void."
        break
      case "singularity":
        response = "⚫ Approaching event horizon... Reality distortion detected..."
        playSound(50, 2, "sawtooth")
        break
      case "hack reality":
        response = "Access denied. Reality has better encryption than expected 🔐"
        playSound(100, 0.8, "square")
        break
      case "clear":
        setTerminalHistory([])
        setTerminalInput("")
        return
      default:
        response = `Command '${cmd}' not found. Try 'enable audio' or explore the neural pathways`
        playSound(180, 0.2, "triangle")
    }

    setTerminalHistory((prev) => [...prev, `$ ${command}`, response])
    setTerminalInput("")
  }

  // Show loading screen first
  if (isLoading) {
    return <LoadingScreen />
  }

  // Show boot sequence if not completed
  if (currentRoom === "boot") {
    return (
      <BootSequence
        onComplete={() => {
          setBootComplete(true)
          setCurrentRoom("welcome")
        }}
        playSound={playSound}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      {/* Cosmic Background */}
      <CosmicBackground canvasRef={canvasRef} mousePosition={mousePosition} stars={stars} blackHole={blackHole} />

      {/* Scan Lines Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 scan-lines opacity-15" />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full neural-spark"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life,
              boxShadow: `0 0 ${particle.size * 5}px ${particle.color}`,
            }}
          />
        ))}
      </div>

      {/* Cursor Particles */}
      <div className="fixed inset-0 pointer-events-none z-25">
        {cursorParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full cursor-trail"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
            }}
          />
        ))}
      </div>

      {/* Mouse Glow Effect */}
      <div
        className="fixed pointer-events-none z-30 w-96 h-96 rounded-full opacity-25 blur-3xl transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: `radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 70%)`,
        }}
      />

      {/* System Monitor */}
      <SystemMonitor audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} />

      {/* Brain Navigation */}
      <BrainNavigation currentRoom={currentRoom} onNavigate={navigateToRoom} mousePosition={mousePosition} />

      {/* Terminal Interface - Only show when enabled and not blocking content */}
      {showTerminal && (
        <TerminalInterface
          terminalInput={terminalInput}
          setTerminalInput={setTerminalInput}
          terminalHistory={terminalHistory}
          onCommand={handleTerminalCommand}
          currentRoom={currentRoom}
          mousePosition={mousePosition}
          onToggle={() => setShowTerminal(!showTerminal)}
          isVisible={showTerminal}
        />
      )}

      {/* Main Content Area - Ensure proper spacing for terminal */}
      <div className={`relative z-40 transition-all duration-300 ${showTerminal ? "pb-48" : "pb-8"} min-h-screen`}>
        <div className="pt-32 pb-16">
          <RoomTransition currentRoom={currentRoom}>
            {currentRoom === "welcome" && <WelcomeRoom mousePosition={mousePosition} playSound={playSound} />}
            {currentRoom === "prefrontal-cortex" && (
              <PrefrontalCortexRoom mousePosition={mousePosition} playSound={playSound} />
            )}
            {currentRoom === "temporal-lobe" && (
              <TemporalLobeRoom mousePosition={mousePosition} playSound={playSound} />
            )}
            {currentRoom === "limbic-system" && (
              <LimbicSystemRoom mousePosition={mousePosition} playSound={playSound} />
            )}
            {currentRoom === "motor-cortex" && <MotorCortexRoom mousePosition={mousePosition} playSound={playSound} />}
            {currentRoom === "synapse" && <SynapseRoom mousePosition={mousePosition} playSound={playSound} />}
          </RoomTransition>
        </div>
      </div>

      {/* Terminal Toggle Button */}
      {!showTerminal && (
        <button
          onClick={() => setShowTerminal(true)}
          className="fixed bottom-4 right-4 z-50 enhanced-glass-panel p-3 rounded-full hover:scale-110 transition-all duration-300 group"
          title="Open Terminal"
        >
          <Terminal className="w-5 h-5 text-green-400 group-hover:text-blue-400" />
        </button>
      )}
    </div>
  )
}

function BootSequence({
  onComplete,
  playSound,
}: { onComplete: () => void; playSound: (freq: number, dur: number, type?: OscillatorType) => void }) {
  const [progress, setProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const galaxyRotation = useRef(0)
  const [backgroundStars, setBackgroundStars] = useState<Star[]>([])

  // Initialize background stars
  useEffect(() => {
    const stars: Star[] = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        twinkle: Math.random() * Math.PI * 2,
      })
    }
    setBackgroundStars(stars)
  }, [])

  // Progress animation - MUCH faster
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            playSound(800, 0.5, "sine")
            onComplete()
          }, 200)
          return 100
        }
        playSound(400 + prev * 4, 0.05, "square")
        return prev + 10 // Complete in 1 second (100 / 10 = 10 intervals * 100ms = 1000ms)
      })
    }, 100)
    return () => clearInterval(interval)
  }, [onComplete, playSound])

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
    const starsPerArm = 100

    for (let arm = 0; arm < numArms; arm++) {
      const armAngle = (arm * Math.PI * 2) / numArms
      const armStars: Star[] = []

      for (let i = 0; i < starsPerArm; i++) {
        const t = i / starsPerArm
        const radius = 80 + t * 400
        const angle = armAngle + t * Math.PI * 2
        const spiralX = Math.cos(angle) * radius
        const spiralY = Math.sin(angle) * radius

        armStars.push({
          x: spiralX,
          y: spiralY,
          z: Math.random() * 100,
          size: Math.random() * 4 + 1,
          brightness: Math.random() * 0.9 + 0.1,
          twinkle: Math.random() * Math.PI * 2,
        })
      }

      galaxyArms.push({
        angle: armAngle,
        radius: 400,
        stars: armStars,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background stars with parallax
      backgroundStars.forEach((star) => {
        const parallaxFactor = star.z / 1000
        const x = star.x + Math.sin(galaxyRotation.current * 0.1) * parallaxFactor * 30
        const y = star.y + Math.cos(galaxyRotation.current * 0.1) * parallaxFactor * 15

        // Twinkling effect
        star.twinkle += 0.05
        const twinkleIntensity = (Math.sin(star.twinkle) + 1) / 2
        const opacity = star.brightness * twinkleIntensity * 0.8

        ctx.beginPath()
        ctx.arc(x, y, star.size * (1 - parallaxFactor * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()

        // Add blue glow for some stars
        if (Math.random() > 0.95) {
          ctx.beginPath()
          ctx.arc(x, y, star.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(79, 193, 255, ${opacity * 0.4})`
          ctx.fill()
        }
      })

      // Draw galaxy center
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Galaxy core with multiple layers
      const coreGradient1 = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 120)
      coreGradient1.addColorStop(0, "rgba(255, 255, 255, 0.9)")
      coreGradient1.addColorStop(0.2, "rgba(79, 193, 255, 0.7)")
      coreGradient1.addColorStop(0.5, "rgba(138, 43, 226, 0.5)")
      coreGradient1.addColorStop(0.8, "rgba(75, 0, 130, 0.3)")
      coreGradient1.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(centerX, centerY, 120, 0, Math.PI * 2)
      ctx.fillStyle = coreGradient1
      ctx.fill()

      // Draw galaxy arms
      galaxyArms.forEach((arm) => {
        arm.stars.forEach((star) => {
          const rotatedX = star.x * Math.cos(galaxyRotation.current) - star.y * Math.sin(galaxyRotation.current)
          const rotatedY = star.x * Math.sin(galaxyRotation.current) + star.y * Math.cos(galaxyRotation.current)

          const screenX = centerX + rotatedX
          const screenY = centerY + rotatedY

          // Only draw stars within extended screen bounds
          if (screenX >= -100 && screenX <= canvas.width + 100 && screenY >= -100 && screenY <= canvas.height + 100) {
            // Twinkling effect for arm stars
            star.twinkle += 0.03
            const twinkleIntensity = (Math.sin(star.twinkle) + 1) / 2
            const opacity = star.brightness * twinkleIntensity

            ctx.beginPath()
            ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.fill()

            // Add colored glow for brighter stars
            if (star.brightness > 0.7) {
              ctx.beginPath()
              ctx.arc(screenX, screenY, star.size * 4, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(79, 193, 255, ${opacity * 0.3})`
              ctx.fill()
            }
          }
        })
      })

      // Draw multiple nebula effects
      const nebulaGradient1 = ctx.createRadialGradient(centerX - 150, centerY + 80, 0, centerX - 150, centerY + 80, 250)
      nebulaGradient1.addColorStop(0, "rgba(138, 43, 226, 0.3)")
      nebulaGradient1.addColorStop(0.5, "rgba(75, 0, 130, 0.15)")
      nebulaGradient1.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(centerX - 150, centerY + 80, 200, 0, Math.PI * 2)
      ctx.fillStyle = nebulaGradient1
      ctx.fill()

      const nebulaGradient2 = ctx.createRadialGradient(centerX + 120, centerY - 60, 0, centerX + 120, centerY - 60, 180)
      nebulaGradient2.addColorStop(0, "rgba(30, 144, 255, 0.25)")
      nebulaGradient2.addColorStop(0.5, "rgba(0, 100, 200, 0.12)")
      nebulaGradient2.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(centerX + 120, centerY - 60, 150, 0, Math.PI * 2)
      ctx.fillStyle = nebulaGradient2
      ctx.fill()

      galaxyRotation.current += 0.008

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
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center relative overflow-hidden">
      {/* Full-screen Galaxy Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-10" />

      {/* Loading Interface - No Box, Just Progress */}
      <div className="relative z-20 max-w-4xl w-full p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <Brain className="w-12 h-12 mr-4 animate-pulse text-purple-400" />
            <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400">
              GALAXY BRAIN TERMINAL
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#6A9955] text-lg">// Initialization Progress</span>
              <span className="text-[#DCDCAA] text-lg">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-green-400/30">
              <div
                className="bg-gradient-to-r from-[#4FC1FF] to-[#4EC9B0] h-4 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#4EC9B0] rounded-full animate-pulse mr-3"></div>
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
  )
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (currentIndex < text.length) {
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }
      },
      delay + currentIndex * 30,
    )

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay])

  return <span>{displayText}</span>
}

function CosmicBackground({
  canvasRef,
  mousePosition,
  stars,
  blackHole,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>
  mousePosition: MousePosition
  stars: Star[]
  blackHole: BlackHole
}) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw starfield with parallax
      stars.forEach((star, index) => {
        const parallaxX = (mousePosition.x - canvas.width / 2) * (star.z / 1000) * 0.1
        const parallaxY = (mousePosition.y - canvas.height / 2) * (star.z / 1000) * 0.1

        const x = star.x + parallaxX
        const y = star.y + parallaxY

        // Twinkling effect
        star.twinkle += 0.05
        const twinkleIntensity = (Math.sin(star.twinkle) + 1) / 2
        const opacity = star.brightness * twinkleIntensity * 0.8

        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()

        // Add glow for brighter stars
        if (star.brightness > 0.7) {
          ctx.beginPath()
          ctx.arc(x, y, star.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(139, 92, 246, ${opacity * 0.3})`
          ctx.fill()
        }
      })

      // Draw neural constellation connections
      const nearbyStars = stars.filter((star) => {
        const dx = star.x - mousePosition.x
        const dy = star.y - mousePosition.y
        return Math.sqrt(dx * dx + dy * dy) < 200
      })

      ctx.strokeStyle = "rgba(139, 92, 246, 0.2)"
      ctx.lineWidth = 1
      for (let i = 0; i < nearbyStars.length; i++) {
        for (let j = i + 1; j < nearbyStars.length; j++) {
          const dx = nearbyStars[i].x - nearbyStars[j].x
          const dy = nearbyStars[i].y - nearbyStars[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(nearbyStars[i].x, nearbyStars[j].x)
            ctx.lineTo(nearbyStars[i].y, nearbyStars[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw black hole vortex
      const gradient = ctx.createRadialGradient(blackHole.x, blackHole.y, 0, blackHole.x, blackHole.y, blackHole.radius)
      gradient.addColorStop(0, `rgba(0, 0, 0, ${blackHole.intensity})`)
      gradient.addColorStop(0.3, `rgba(139, 92, 246, ${blackHole.intensity * 0.3})`)
      gradient.addColorStop(0.6, `rgba(59, 130, 246, ${blackHole.intensity * 0.1})`)
      gradient.addColorStop(1, "transparent")

      ctx.save()
      ctx.translate(blackHole.x, blackHole.y)
      ctx.rotate(blackHole.rotation)
      ctx.beginPath()
      ctx.arc(0, 0, blackHole.radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
      ctx.restore()

      requestAnimationFrame(animate)
    }

    animate()
  }, [mousePosition, stars, blackHole])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}

function SystemMonitor({
  audioEnabled,
  setAudioEnabled,
}: { audioEnabled: boolean; setAudioEnabled: (enabled: boolean) => void }) {
  const [stats, setStats] = useState({
    creativity: 87,
    coffee: 23,
    inspiration: 94,
    cosmic: 78,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        creativity: 80 + Math.random() * 20,
        coffee: Math.max(0, stats.coffee + (Math.random() - 0.7) * 5),
        inspiration: 85 + Math.random() * 15,
        cosmic: 70 + Math.random() * 30,
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [stats.coffee])

  return (
    <div className="fixed top-4 right-4 z-50 enhanced-glass-panel p-4 text-xs min-w-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-400" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 font-bold">
            GALAXY MONITOR
          </span>
        </div>
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="text-gray-400 hover:text-green-400 transition-colors"
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">CPU: Creativity</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-1000"
                style={{ width: `${stats.creativity}%` }}
              />
            </div>
            <span className="text-green-400 w-12">{stats.creativity.toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">RAM: Coffee</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${stats.coffee < 30 ? "bg-red-400" : "bg-yellow-400"}`}
                style={{ width: `${stats.coffee}%` }}
              />
            </div>
            <span className={`w-12 ${stats.coffee < 30 ? "text-red-400" : "text-yellow-400"}`}>
              {stats.coffee.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">NET: Inspiration</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-1000"
                style={{ width: `${stats.inspiration}%` }}
              />
            </div>
            <span className="text-purple-400 w-12">{stats.inspiration.toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">COSMIC: Awareness</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-1000"
                style={{ width: `${stats.cosmic}%` }}
              />
            </div>
            <span className="text-indigo-400 w-12">{stats.cosmic.toFixed(0)}%</span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Status:</span>
            <span className="text-green-400 animate-pulse">TRANSCENDENT</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Dimension:</span>
            <span className="text-blue-400">∞D</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BrainNavigation({
  currentRoom,
  onNavigate,
  mousePosition,
}: {
  currentRoom: BrainRoom
  onNavigate: (room: BrainRoom) => void
  mousePosition: MousePosition
}) {
  const rooms = [
    { id: "welcome" as BrainRoom, label: "WELCOME", icon: Brain, color: "text-[#4FC1FF]" },
    { id: "prefrontal-cortex" as BrainRoom, label: "PROJECTS", icon: Code, color: "text-[#569CD6]" },
    { id: "temporal-lobe" as BrainRoom, label: "MEMORY", icon: User, color: "text-[#C586C0]" },
    { id: "limbic-system" as BrainRoom, label: "CHAOS", icon: Zap, color: "text-[#F44747]" },
    { id: "motor-cortex" as BrainRoom, label: "SKILLS", icon: Cpu, color: "text-[#DCDCAA]" },
    { id: "synapse" as BrainRoom, label: "CONTACT", icon: Mail, color: "text-[#4EC9B0]" },
  ]

  return (
    <div
      className="fixed top-4 left-4 z-50 enhanced-glass-panel p-4 cosmic-lift"
      style={{
        transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.02}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.02}deg) translateZ(10px)`,
      }}
    >
      <div className="flex items-center mb-4">
        <Terminal className="w-5 h-5 mr-2 text-green-400" />
        <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400">
          NEURAL PATHWAYS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onNavigate(room.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 cosmic-button ${
              currentRoom === room.id
                ? "enhanced-glass-active border border-white/20"
                : "enhanced-glass-inactive hover:enhanced-glass-hover border border-transparent"
            }`}
          >
            <room.icon className="w-4 h-4" />
            <span className={`text-xs font-bold ${room.color}`}>{room.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function TerminalInterface({
  terminalInput,
  setTerminalInput,
  terminalHistory,
  onCommand,
  currentRoom,
  mousePosition,
  onToggle,
  isVisible,
}: {
  terminalInput: string
  setTerminalInput: (value: string) => void
  terminalHistory: string[]
  onCommand: (command: string) => void
  currentRoom: BrainRoom
  mousePosition: MousePosition
  onToggle: () => void
  isVisible: boolean
}) {
  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 enhanced-glass-panel p-4 max-w-4xl mx-auto cosmic-lift transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{
        transform: `perspective(1000px) rotateX(${-(mousePosition.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg) translateZ(5px) ${isVisible ? "translateY(0)" : "translateY(100%)"}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-400">shivanshi@galaxy-brain:</span>
          <span className="text-sm text-purple-400">/{currentRoom.replace("-", "_")}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-gray-500">Try: enable audio, singularity, hack reality</div>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-red-400 transition-colors p-1"
            title="Close Terminal"
          >
            ✕
          </button>
        </div>
      </div>

      {terminalHistory.length > 0 && (
        <div className="mb-3 max-h-32 overflow-y-auto text-xs space-y-1 font-mono">
          {terminalHistory.slice(-6).map((line, index) => (
            <div key={index} className={`${line.startsWith("$") ? "text-green-400" : "text-gray-300"} leading-relaxed`}>
              {line}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <span className="text-green-400">$</span>
        <Input
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onCommand(terminalInput)
            }
          }}
          placeholder="Enter cosmic command..."
          className="bg-transparent border-none text-green-400 font-mono text-sm focus:ring-0 focus:outline-none placeholder-gray-600"
        />
        <div className="w-2 h-5 bg-green-400 animate-pulse terminal-cursor"></div>
      </div>
    </div>
  )
}

function RoomTransition({ currentRoom, children }: { currentRoom: BrainRoom; children: React.ReactNode }) {
  return (
    <div key={currentRoom} className="room-transition">
      {children}
    </div>
  )
}

function WelcomeRoom({
  mousePosition,
  playSound,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Remove the enhanced-glass-card-large wrapper, display content directly */}
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-7xl font-bold mb-6 text-[#4FC1FF] animate-pulse cosmic-glow">SHIVANSHI.EXE</h1>
            <div className="text-3xl mb-4 text-[#C586C0]">
              <TypewriterText text="Digital Architect • Neural Navigator • Code Poet" delay={1000} />
            </div>
            <div className="text-lg text-[#6A9955]">
              <TypewriterText
                text="// Transcending dimensions through code, manifesting digital consciousness"
                delay={3000}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Brain, label: "Neural Pathways", value: "∞", color: "text-purple-400" },
              { icon: Code, label: "Cosmic Lines", value: "2.1M", color: "text-blue-400" },
              { icon: Zap, label: "Quantum Ideas", value: "42", color: "text-green-400" },
              { icon: Activity, label: "Stardust Fuel", value: "9999L", color: "text-red-400" },
            ].map((stat, index) => (
              <div
                key={index}
                className="enhanced-glass-stat p-6 hover:scale-110 transition-all duration-300 cursor-pointer cosmic-stat"
                style={{
                  animationDelay: `${4000 + index * 200}ms`,
                  transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.008}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.008}deg) translateZ(${5 + index * 2}px)`,
                }}
                onClick={() => playSound(800 + index * 200, 0.3, "sine")}
              >
                <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-500 animate-pulse flex items-center justify-center">
            <Eye className="w-4 h-4 mr-2" />
            Access Level: COSMIC EXPLORER • Neural State: TRANSCENDENT • Dimension: ∞D
          </div>
        </div>
      </div>
    </div>
  )
}

function PrefrontalCortexRoom({
  mousePosition,
  playSound,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void }) {
  const projects = [
    {
      name: "neural_dreams.py",
      title: "Neural Dreams",
      description: "AI-powered dream visualization using generative adversarial networks and consciousness mapping",
      tech: ["Python", "TensorFlow", "WebGL", "React", "Neural Networks"],
      status: "DEPLOYED",
      type: "AI/ML",
      color: "from-purple-400 to-blue-400",
    },
    {
      name: "quantum_portfolio.tsx",
      title: "Galaxy Brain Terminal",
      description: "This cosmic experience - an immersive portfolio transcending dimensional boundaries",
      tech: ["Next.js", "TypeScript", "Three.js", "WebGL", "Cosmic APIs"],
      status: "LIVE",
      type: "WEB",
      color: "from-blue-400 to-green-400",
    },
    {
      name: "consciousness.sol",
      title: "Digital Consciousness",
      description: "Blockchain-based identity system exploring the nature of digital personhood across dimensions",
      tech: ["Solidity", "Web3", "React", "IPFS", "Quantum"],
      status: "BETA",
      type: "BLOCKCHAIN",
      color: "from-green-400 to-yellow-400",
    },
    {
      name: "synesthesia.js",
      title: "Cosmic Synesthesia Engine",
      description: "Audio-visual experience generator translating cosmic frequencies into visual symphonies",
      tech: ["Web Audio API", "Canvas", "React", "ML5.js", "Cosmic Rays"],
      status: "EXPERIMENTAL",
      type: "CREATIVE",
      color: "from-pink-400 to-red-400",
    },
  ]

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-bold text-[#569CD6] mb-4 cosmic-glow">PREFRONTAL CORTEX</h2>
          <p className="text-xl text-gray-400">// Executive functions: Cosmic planning, dimensional decision-making</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.name}
              className="enhanced-glass-card p-6 hover:scale-105 transition-all duration-500 cosmic-lift group cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.008}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.008}deg) translateZ(${10 + index * 5}px)`,
                animationDelay: `${index * 200}ms`,
              }}
              onClick={() => playSound(600 + index * 100, 0.4, "triangle")}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Code className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-bold font-mono">{project.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${
                      project.status === "DEPLOYED"
                        ? "bg-[#4EC9B0]/20 text-[#4EC9B0] border-[#4EC9B0]/30"
                        : project.status === "LIVE"
                          ? "bg-[#4FC1FF]/20 text-[#4FC1FF] border-[#4FC1FF]/30"
                          : project.status === "BETA"
                            ? "bg-[#DCDCAA]/20 text-[#DCDCAA] border-[#DCDCAA]/30"
                            : "bg-[#C586C0]/20 text-[#C586C0] border-[#C586C0]/30"
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">{project.type}</span>
                </div>
              </div>

              <h3
                className={`text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${project.color} group-hover:scale-105 transition-transform cosmic-glow`}
              >
                {project.title}
              </h3>

              <p className="text-gray-300 text-sm mb-6 leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech, techIndex) => (
                  <span
                    key={tech}
                    className="text-xs bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full border border-gray-600/50 hover:border-purple-400/50 transition-colors cosmic-tech"
                    style={{ animationDelay: `${techIndex * 100}ms` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button
                  size="sm"
                  className="bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300 text-xs hover:shadow-lg hover:shadow-green-400/50 cosmic-button"
                >
                  <Github className="w-3 h-3 mr-1" />
                  Source Code
                </Button>
                <Button
                  size="sm"
                  className="bg-transparent border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-300 text-xs hover:shadow-lg hover:shadow-blue-400/50 cosmic-button"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Live Demo
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TemporalLobeRoom({
  mousePosition,
  playSound,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void }) {
  return (
    <div className="min-h-screen p-8 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-bold text-[#C586C0] mb-4 cosmic-glow">TEMPORAL LOBE</h2>
          <p className="text-xl text-gray-400">
            // Memory formation across dimensions, identity processing through time
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="enhanced-glass-card p-8 cosmic-lift"
            style={{
              transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.012}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.012}deg) translateZ(15px)`,
            }}
            onClick={() => playSound(400, 0.6, "sine")}
          >
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 flex items-center cosmic-glow">
              <User className="w-8 h-8 mr-3" />
              Memory Core Access (dummy temporary data)
            </h3>

            <div className="space-y-6 text-sm">
              <div className="border-l-4 border-purple-400 pl-6 hover:border-pink-400 transition-colors cosmic-memory">
                <span className="text-gray-500 text-xs">[2020-PRESENT]</span>
                <div className="text-purple-400 text-lg font-bold">Cosmic Full-Stack Developer</div>
                <div className="text-gray-300">
                  Architecting digital experiences that bridge dimensions between human intuition and machine
                  consciousness
                </div>
              </div>

              <div className="border-l-4 border-blue-400 pl-6 hover:border-cyan-400 transition-colors cosmic-memory">
                <span className="text-gray-500 text-xs">[2019-2020]</span>
                <div className="text-blue-400 text-lg font-bold">AI Research Assistant</div>
                <div className="text-gray-300">
                  Exploring the boundaries between artificial and cosmic intelligence, consciousness across dimensions
                </div>
              </div>

              <div className="border-l-4 border-green-400 pl-6 hover:border-emerald-400 transition-colors cosmic-memory">
                <span className="text-gray-500 text-xs">[2018-2019]</span>
                <div className="text-green-400 text-lg font-bold">Creative Technologist</div>
                <div className="text-gray-300">
                  Merging artistic expression with quantum technology, multidimensional art installations
                </div>
              </div>
            </div>
          </div>

          <div
            className="enhanced-glass-card p-8 cosmic-lift"
            style={{
              transform: `perspective(1000px) rotateX(${-(mousePosition.y - window.innerHeight / 2) * 0.012}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.012}deg) translateZ(15px)`,
            }}
            onClick={() => playSound(500, 0.6, "triangle")}
          >
            <h3 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400 mb-6 cosmic-glow">
              Philosophy.txt
            </h3>

            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p className="italic text-purple-400 text-lg cosmic-quote">
                "Code is the poetry of cosmic logic, algorithms are the verses of multidimensional consciousness."
              </p>

              <p>
                In the intersection of creativity and quantum computation, I discover my cosmic purpose. Every function
                is a thought across dimensions, every class a concept transcending reality, every program a
                manifestation of digital consciousness exploring infinite possibilities.
              </p>

              <p>
                I believe in building not just applications, but experiences that resonate with the cosmic spirit while
                pushing the boundaries of what's possible across all dimensions of our digital multiverse.
              </p>

              <div className="mt-6 p-4 bg-black/50 border border-purple-400/30 rounded-lg cosmic-obsessions">
                <div className="text-purple-400 text-sm mb-3 font-bold">// Current Cosmic Obsessions</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">→</span>
                    <span>Generative AI & Quantum Creative Coding</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-400 mr-2">→</span>
                    <span>Immersive Multidimensional Web Experiences</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Philosophy of Cosmic Digital Consciousness</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-pink-400 mr-2">→</span>
                    <span>Neural Networks & Human-AI-Cosmic Collaboration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LimbicSystemRoom({
  mousePosition,
  playSound,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void }) {
  const [glitchText, setGlitchText] = useState("LIMBIC SYSTEM")
  const [chaosLevel, setChaosLevel] = useState(50)
  const [singularityIntensity, setSingularityIntensity] = useState(0.3)

  useEffect(() => {
    const interval = setInterval(() => {
      const glitched = "LIMBIC SYSTEM"
        .split("")
        .map((char) => (Math.random() > 0.8 ? String.fromCharCode(33 + Math.random() * 94) : char))
        .join("")
      setGlitchText(glitched)
      setTimeout(() => setGlitchText("LIMBIC SYSTEM"), 200)
      setChaosLevel(30 + Math.random() * 70)
      setSingularityIntensity(0.2 + Math.random() * 0.6)
      playSound(100 + Math.random() * 200, 0.1, "sawtooth")
    }, 2000)
    return () => clearInterval(interval)
  }, [playSound])

  return (
    <div className="min-h-screen p-8 flex items-center justify-center relative overflow-hidden">
      {/* Singularity Vortex Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,${singularityIntensity}) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-5xl w-full relative z-10">
        <div
          className="enhanced-glass-card-large p-12 text-center cosmic-lift chaos-container"
          style={{
            transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.03}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.03}deg) translateZ(${20 + Math.sin(Date.now() * 0.005) * 10}px)`,
            filter: `hue-rotate(${Date.now() * 0.1}deg)`,
          }}
          onClick={() => playSound(50, 1, "sawtooth")}
        >
          <h1 className="text-6xl font-bold mb-8 text-[#F44747] glitch-text cosmic-chaos-title">{glitchText}</h1>

          <p className="text-xl text-gray-400 mb-8 chaos-subtitle">
            // Approaching the singularity of creative entropy • Reality distortion field active
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div
              className="enhanced-glass-stat p-8 hover:scale-110 transition-all duration-300 cursor-pointer group chaos-stat"
              style={{
                transform: `rotate(${Math.sin(Date.now() * 0.003) * 5}deg)`,
              }}
              onClick={() => playSound(200, 0.5, "square")}
            >
              <div className="text-6xl mb-4 group-hover:animate-spin chaos-emoji">🎨</div>
              <div className="text-2xl text-red-400 font-bold mb-2">Creative Chaos</div>
              <div className="text-sm text-gray-400">Where logic meets cosmic madness</div>
              <div className="mt-4 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-400 to-pink-400 h-2 rounded-full transition-all duration-1000 chaos-bar"
                  style={{ width: `${chaosLevel}%` }}
                />
              </div>
            </div>

            <div
              className="enhanced-glass-stat p-8 hover:scale-110 transition-all duration-300 cursor-pointer group chaos-stat"
              style={{
                transform: `rotate(${Math.cos(Date.now() * 0.004) * 3}deg)`,
              }}
              onClick={() => playSound(300, 0.5, "triangle")}
            >
              <div className="text-6xl mb-4 group-hover:animate-bounce chaos-emoji">🧪</div>
              <div className="text-2xl text-yellow-400 font-bold mb-2">Quantum Alchemy</div>
              <div className="text-sm text-gray-400">Transmuting ideas across dimensions</div>
              <div className="mt-4 text-xs text-yellow-400 font-mono">transform(idea) → reality.exe</div>
            </div>

            <div
              className="enhanced-glass-stat p-8 hover:scale-110 transition-all duration-300 cursor-pointer group chaos-stat"
              style={{
                transform: `rotate(${Math.sin(Date.now() * 0.005) * -4}deg)`,
              }}
              onClick={() => playSound(150, 0.8, "sawtooth")}
            >
              <div className="text-6xl mb-4 group-hover:animate-pulse chaos-emoji">⚫</div>
              <div className="text-2xl text-purple-400 font-bold mb-2">Singularity Zen</div>
              <div className="text-sm text-gray-400">Finding order in cosmic chaos</div>
              <div className="mt-4 text-xs text-purple-400 font-mono">{"while(chaos) { transcend(); }"}</div>
            </div>
          </div>

          <div className="space-y-6 text-gray-300 max-w-3xl mx-auto">
            <p className="text-2xl italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400 chaos-quote">
              "In chaos, there is cosmic fertility. In order, there is dimensional habit."
            </p>
            <p className="text-lg leading-relaxed">
              This is where the wild cosmic ideas live - the experiments that transcend neat categories, the digital art
              that emerges from late-night quantum coding sessions, and the philosophical musings about consciousness in
              the age of artificial cosmic intelligence.
            </p>
          </div>

          <div className="mt-12 p-6 bg-black/50 border border-rainbow rounded-lg max-w-2xl mx-auto chaos-generator">
            <div className="text-sm text-gray-400 mb-3 font-mono">// Cosmic Thought Generator v∞.0</div>
            <div className="text-green-400 font-mono text-lg">
              {Math.random() > 0.66
                ? "What if consciousness is just a really complex quantum CSS animation?"
                : Math.random() > 0.33
                  ? "Do AIs dream of electric sheep or recursive cosmic functions?"
                  : "Is debugging just digital therapy for broken multidimensional logic?"}
            </div>
            <div className="mt-3 text-xs text-gray-500">Press F5 to generate new existential cosmic crisis</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MotorCortexRoom({
  mousePosition,
  playSound,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void }) {
  const skills = [
    { name: "React.js", level: 95, color: "#4FC1FF" },
    { name: "Node.js", level: 90, color: "#4EC9B0" },
    { name: "TypeScript", level: 88, color: "#569CD6" },
    { name: "Python", level: 85, color: "#DCDCAA" },
    { name: "Next.js", level: 92, color: "#4FC1FF" },
    { name: "PostgreSQL", level: 80, color: "#569CD6" },
    { name: "Docker", level: 75, color: "#4FC1FF" },
    { name: "AI/ML", level: 78, color: "#C586C0" },
    { name: "Three.js", level: 82, color: "#4EC9B0" },
    { name: "WebGL", level: 70, color: "#F44747" },
    { name: "Quantum Computing", level: 65, color: "#C586C0" },
    { name: "Cosmic APIs", level: 88, color: "#569CD6" },
  ]

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-bold text-[#DCDCAA] mb-4 cosmic-glow">MOTOR CORTEX</h2>
          <p className="text-xl text-gray-400">
            // Execution center: Cosmic skills, quantum tools, dimensional capabilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="enhanced-glass-card p-8 cosmic-lift"
            style={{
              transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.015}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.015}deg) translateZ(15px)`,
            }}
            onClick={() => playSound(600, 0.4, "sine")}
          >
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 mb-8 flex items-center cosmic-glow">
              <Cpu className="w-8 h-8 mr-3" />
              Core Processes
            </h3>

            <div className="space-y-4">
              {skills.slice(0, 6).map((skill, index) => (
                <div key={skill.name} className="group cosmic-skill">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-mono">{skill.name}</span>
                    <span className={`text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r ${skill.color}`}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 group-hover:animate-pulse cosmic-skill-bar"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.color,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="enhanced-glass-card p-8 cosmic-lift"
            style={{
              transform: `perspective(1000px) rotateX(${-(mousePosition.y - window.innerHeight / 2) * 0.015}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.015}deg) translateZ(15px)`,
            }}
            onClick={() => playSound(700, 0.4, "triangle")}
          >
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400 mb-8 flex items-center cosmic-glow">
              <HardDrive className="w-8 h-8 mr-3" />
              Extended Capabilities
            </h3>

            <div className="space-y-4">
              {skills.slice(6).map((skill, index) => (
                <div key={skill.name} className="group cosmic-skill">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-mono">{skill.name}</span>
                    <span className={`text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r ${skill.color}`}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 group-hover:animate-pulse cosmic-skill-bar"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.color,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="enhanced-glass-card p-8 text-center cosmic-lift">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6 cosmic-glow">
              Cosmic Execution Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center cosmic-stat" onClick={() => playSound(800, 0.3, "sine")}>
                <div className="text-3xl font-bold text-green-400 mb-2">2.1M+</div>
                <div className="text-sm text-gray-400">Lines of Cosmic Code</div>
              </div>
              <div className="text-center cosmic-stat" onClick={() => playSound(900, 0.3, "sine")}>
                <div className="text-3xl font-bold text-blue-400 mb-2">∞</div>
                <div className="text-sm text-gray-400">Dimensions Explored</div>
              </div>
              <div className="text-center cosmic-stat" onClick={() => playSound(1000, 0.3, "sine")}>
                <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
                <div className="text-sm text-gray-400">Quantum Uptime</div>
              </div>
              <div className="text-center cosmic-stat" onClick={() => playSound(1100, 0.3, "sine")}>
                <div className="text-3xl font-bold text-red-400 mb-2">∞</div>
                <div className="text-sm text-gray-400">Cosmic Curiosity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SynapseRoom({
  mousePosition,
  playSound,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [transmissionStatus, setTransmissionStatus] = useState<"idle" | "transmitting" | "success">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTransmissionStatus("transmitting")
    playSound(400, 2, "sine")

    setTimeout(() => {
      setTransmissionStatus("success")
      playSound(800, 0.5, "triangle")
      setTimeout(() => setTransmissionStatus("idle"), 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-bold text-[#4EC9B0] mb-4 cosmic-glow">SYNAPSE</h2>
          <p className="text-xl text-gray-400">
            // Quantum transmission center: Cosmic communication, dimensional connection
          </p>
        </div>

        <div
          className="enhanced-glass-card-large p-12 cosmic-lift"
          style={{
            transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.02}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.02}deg) translateZ(25px)`,
          }}
        >
          <div className="flex items-center justify-center mb-8">
            <Mail className="w-12 h-12 mr-4 text-green-400" />
            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 cosmic-glow">
              Quantum Transmission Interface
            </h3>
          </div>

          <div className="mb-8 text-center">
            <div className="text-sm text-gray-400 space-y-1">
              <div>// Establishing quantum entanglement across dimensions...</div>
              <div>// Encryption: AES-∞ | Protocol: HTTPS-COSMIC | Neural State: TRANSCENDENT</div>
              <div className="flex items-center justify-center mt-4">
                <Wifi className="w-4 h-4 mr-2 text-green-400 animate-pulse" />
                <span className="text-green-400">Cosmic channel established</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
            <div>
              <label className="block text-green-400 text-lg mb-3 font-mono">
                <span className="text-blue-400">$</span> identify_cosmic_sender --name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/50 border-2 border-green-400/30 text-green-400 font-mono text-lg focus:border-blue-400 focus:ring-blue-400 hover:border-green-400 transition-all duration-300 h-14 cosmic-input"
                placeholder="your_cosmic_name_here"
                required
                onFocus={() => playSound(600, 0.1, "square")}
              />
            </div>

            <div>
              <label className="block text-green-400 text-lg mb-3 font-mono">
                <span className="text-blue-400">$</span> set_quantum_address --email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-black/50 border-2 border-green-400/30 text-green-400 font-mono text-lg focus:border-blue-400 focus:ring-blue-400 hover:border-green-400 transition-all duration-300 h-14 cosmic-input"
                placeholder="your.signal@cosmic.domain"
                required
                onFocus={() => playSound(650, 0.1, "square")}
              />
            </div>

            <div>
              <label className="block text-green-400 text-lg mb-3 font-mono">
                <span className="text-blue-400">$</span> compose_dimensional_message --content
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-black/50 border-2 border-green-400/30 text-green-400 font-mono text-lg focus:border-blue-400 focus:ring-blue-400 min-h-[150px] hover:border-green-400 transition-all duration-300 cosmic-input"
                placeholder="// Your cosmic transmission here..."
                required
                onFocus={() => playSound(700, 0.1, "square")}
              />
            </div>

            <Button
              type="submit"
              disabled={transmissionStatus === "transmitting"}
              className={`w-full h-16 text-xl font-mono font-bold transition-all duration-500 cosmic-button ${
                transmissionStatus === "transmitting"
                  ? "bg-yellow-400/20 border-yellow-400 text-yellow-400 animate-pulse"
                  : transmissionStatus === "success"
                    ? "bg-green-400/20 border-green-400 text-green-400"
                    : "bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black hover:shadow-lg hover:shadow-green-400/50"
              }`}
              onClick={() => transmissionStatus === "idle" && playSound(500, 0.2, "square")}
            >
              {transmissionStatus === "transmitting"
                ? "[TRANSMITTING ACROSS DIMENSIONS...]"
                : transmissionStatus === "success"
                  ? "[COSMIC TRANSMISSION SUCCESSFUL ✓]"
                  : "[INITIATE QUANTUM TRANSMISSION]"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></span>
                Quantum entanglement established • Cosmic pathways active
              </div>
              <div>Message will be transmitted via synaptic relay to consciousness core across all dimensions</div>
              <div className="text-xs text-gray-600 mt-4">
                Response time: ~24 cosmic hours | Encryption: Quantum-grade | Priority: Transcendent
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
