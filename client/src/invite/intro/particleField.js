/*
 * Canvas particle atmosphere for the invitation intro — no library.
 *
 * Each preset describes what drifts through the air behind the curtain or
 * envelope: petals for a wedding, confetti for a birthday, embers for a
 * night party. Presets are picked per template tone in themes.js.
 */

const TAU = Math.PI * 2
const rand = (min, max) => min + Math.random() * (max - min)
const pick = (list) => list[Math.floor(Math.random() * list.length)]

/*
 * A preset supplies: how many particles, their palette, how one is born,
 * and how one is painted (already translated + rotated to its position).
 * `rise: true` sends them upward and respawns them at the bottom.
 */
export const presets = {
  petals: {
    count: 24,
    colors: ['#ffd7ea', '#ffc4d8', '#fff2f7', '#f3bcd6'],
    alpha: 0.9,
    make: () => ({ size: rand(8, 15), vy: rand(22, 46), vx: rand(-12, 12), vr: rand(-1.4, 1.4), sway: rand(14, 30), swaySpeed: rand(0.5, 1.2) }),
    draw: (ctx, p) => {
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.3, 0, 0, TAU)
      ctx.fill()
    },
  },
  confetti: {
    count: 34,
    colors: ['#ffd166', '#ff8fa3', '#8ad6ff', '#b8f2c9', '#ffffff'],
    alpha: 0.95,
    make: () => ({ size: rand(6, 11), vy: rand(45, 95), vx: rand(-22, 22), vr: rand(-3.5, 3.5), sway: rand(10, 26), swaySpeed: rand(0.8, 1.8) }),
    draw: (ctx, p) => {
      // scaleY flip fakes the tumble of a paper strip
      ctx.scale(1, Math.cos(p.rot * 1.6))
      ctx.fillRect(-p.size * 0.5, -p.size * 0.28, p.size, p.size * 0.56)
    },
  },
  embers: {
    count: 30,
    colors: ['#ffb066', '#ff8a5c', '#ffd9a0', '#c9a6ff'],
    alpha: 0.75,
    rise: true,
    glow: 10,
    make: () => ({ size: rand(2, 4.5), vy: rand(26, 62), vx: rand(-9, 9), vr: 0, sway: rand(8, 20), swaySpeed: rand(0.6, 1.5) }),
    draw: (ctx, p) => {
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, TAU)
      ctx.fill()
    },
  },
  goldDust: {
    count: 40,
    colors: ['#d9b25c', '#f0d9a0', '#ffffff'],
    alpha: 0.6,
    rise: true,
    glow: 6,
    make: () => ({ size: rand(1, 2.6), vy: rand(8, 22), vx: rand(-5, 5), vr: 0, sway: rand(6, 16), swaySpeed: rand(0.3, 0.9), twinkle: rand(0.6, 1.8) }),
    draw: (ctx, p) => {
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, TAU)
      ctx.fill()
    },
  },
  snow: {
    count: 32,
    colors: ['#ffffff', '#e6f0ff', '#cfe4ff'],
    alpha: 0.7,
    make: () => ({ size: rand(1.6, 3.8), vy: rand(16, 34), vx: rand(-6, 6), vr: 0, sway: rand(10, 24), swaySpeed: rand(0.4, 1) }),
    draw: (ctx, p) => {
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, TAU)
      ctx.fill()
    },
  },
  bubbles: {
    count: 22,
    colors: ['#ffffff', '#d8ecff', '#bfe3ff'],
    alpha: 0.45,
    rise: true,
    make: () => ({ size: rand(5, 14), vy: rand(14, 34), vx: rand(-7, 7), vr: 0, sway: rand(12, 28), swaySpeed: rand(0.4, 1) }),
    draw: (ctx, p) => {
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, TAU)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.18, 0, TAU)
      ctx.fill()
    },
  },
}

function spawn(preset, width, height, seeded) {
  const particle = preset.make()
  particle.x = rand(0, width)
  // seeded: fill the screen on first frame; otherwise enter from off-screen
  particle.y = seeded ? rand(0, height) : preset.rise ? height + rand(10, 90) : -rand(10, 90)
  particle.rot = rand(0, TAU)
  particle.phase = rand(0, TAU)
  particle.color = pick(preset.colors)
  return particle
}

/*
 * Starts the animation on a canvas and returns a stop() function.
 * Density is halved on small screens — a phone should not paint 40 sprites.
 */
export function startParticles(canvas, presetName) {
  const preset = presets[presetName]
  if (!canvas || !preset) return () => {}
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  let width = 0
  let height = 0
  let particles = []
  let frame = 0
  let last = performance.now()
  let elapsed = 0

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    width = canvas.clientWidth
    height = canvas.clientHeight
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    const density = width < 560 ? 0.55 : 1
    const target = Math.max(8, Math.round(preset.count * density))
    particles = Array.from({ length: target }, () => spawn(preset, width, height, true))
  }

  function step(now) {
    const delta = Math.min((now - last) / 1000, 0.05)
    last = now
    elapsed += delta
    ctx.clearRect(0, 0, width, height)

    for (const p of particles) {
      p.y += (preset.rise ? -p.vy : p.vy) * delta
      p.x += (p.vx + Math.sin(elapsed * p.swaySpeed + p.phase) * p.sway) * delta
      p.rot += p.vr * delta

      const margin = p.size * 3
      if (preset.rise ? p.y < -margin : p.y > height + margin) Object.assign(p, spawn(preset, width, height, false))
      if (p.x < -margin) p.x = width + margin
      if (p.x > width + margin) p.x = -margin

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = preset.alpha * (p.twinkle ? 0.5 + 0.5 * Math.sin(elapsed * p.twinkle + p.phase) : 1)
      ctx.fillStyle = p.color
      ctx.strokeStyle = p.color
      if (preset.glow) { ctx.shadowColor = p.color; ctx.shadowBlur = preset.glow }
      preset.draw(ctx, p)
      ctx.restore()
    }
    frame = requestAnimationFrame(step)
  }

  resize()
  window.addEventListener('resize', resize)
  frame = requestAnimationFrame(step)

  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', resize)
  }
}
