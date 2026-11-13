import { useEffect, useRef, useState } from 'react'
import { tokenVec3 } from '../lib/color'
import { FRAGMENT, VERTEX } from './silkShader'
import './SilkBackground.css'

const INTRO_MS = 2800
const MAX_DPR = 1.5

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('[SilkBackground]', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function createProgram(gl: WebGL2RenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  if (!vs || !fs) return null
  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('[SilkBackground]', gl.getProgramInfoLog(prog))
    return null
  }
  return prog
}

/** Animated WebGL backdrop. Falls back to a CSS gradient if WebGL2 is unavailable. */
export function SilkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'fallback'>('loading')

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!canvas || !gl) return setState('fallback')
    const prog = createProgram(gl)
    if (!prog) return setState('fallback')

    gl.useProgram(prog)
    const u = (name: string) => gl.getUniformLocation(prog, name)
    const uRes = u('uRes')
    const uTime = u('uTime')
    const uIntro = u('uIntro')
    const uDpr = u('uDpr')
    const uMouse = u('uMouse')

    const colors: Array<[string, string]> = [
      ['uBgTop', '--shader-bg-top'],
      ['uBgBottom', '--shader-bg-bottom'],
      ['uGlowCool', '--shader-glow-cool'],
      ['uGlowWarm', '--shader-glow-warm'],
      ['uGoldDeep', '--shader-gold-deep'],
      ['uGoldLight', '--shader-gold-light'],
    ]
    for (const [uniform, token] of colors) gl.uniform3fv(u(uniform), tokenVec3(token))

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    let raf = 0
    let dpr = 1
    const start = performance.now()

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (reduce.matches) render(performance.now())
    }

    const render = (now: number) => {
      const elapsed = now - start
      const still = reduce.matches
      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, still ? 14 : 14 + elapsed / 1000)
      gl.uniform1f(uIntro, still ? 1 : Math.min(1, elapsed / INTRO_MS))
      gl.uniform1f(uDpr, dpr)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      render(now)
      raf = requestAnimationFrame(loop)
    }

    const run = () => {
      cancelAnimationFrame(raf)
      if (reduce.matches) render(performance.now())
      else raf = requestAnimationFrame(loop)
    }

    const onPointer = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
    }

    const onLost = (e: Event) => {
      e.preventDefault()
      cancelAnimationFrame(raf)
      setState('fallback')
    }

    resize()
    run()
    setState('ready')

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    reduce.addEventListener('change', run)
    canvas.addEventListener('webglcontextlost', onLost)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      reduce.removeEventListener('change', run)
      canvas.removeEventListener('webglcontextlost', onLost)
    }
  }, [])

  return (
    <div className={`silk silk--${state}`} aria-hidden="true">
      <canvas ref={canvasRef} className="silk__canvas" />
    </div>
  )
}
