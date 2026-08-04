import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks.js'

// GPU atmosphere: a domain-warped noise aurora rendered by a fragment shader
// at half resolution behind everything else. It breathes with time, tints to
// the active section's hue, parallaxes gently toward the cursor, and gains
// energy while you scroll. No libraries; the GPU is the tool.
// Reduced motion: one static frame. WebGL unavailable: silently absent.
const SECTION_HUES = {
  top: 245,
  about: 243,
  experience: 254,
  project: 264,
  skills: 234,
  recognition: 248,
  certifications: 252,
  writing: 258,
  contact: 272,
}

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_t;
uniform float u_hue;
uniform vec2 u_m;
uniform float u_v;
uniform float u_storm;
uniform float u_flash;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.0);
    a *= 0.5;
  }
  return s;
}
vec3 hue2rgb(float h) {
  h = mod(h, 360.0) / 60.0;
  float c = 1.0;
  float x = 1.0 - abs(mod(h, 2.0) - 1.0);
  vec3 rgb = h < 1.0 ? vec3(c, x, 0.0)
    : h < 2.0 ? vec3(x, c, 0.0)
    : h < 3.0 ? vec3(0.0, c, x)
    : h < 4.0 ? vec3(0.0, x, c)
    : h < 5.0 ? vec3(x, 0.0, c)
    : vec3(c, 0.0, x);
  return mix(vec3(1.0), rgb, 0.72);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 asp = vec2(u_res.x / u_res.y, 1.0);
  vec2 p = uv * asp * 1.7;
  vec2 drift = (u_m - 0.5) * 0.14;
  float t = u_t * 0.028;
  float wamp = 1.0 + u_storm * 0.8;
  vec2 warp = vec2(
    fbm(p * 0.9 * wamp + t + drift),
    fbm(p * 0.9 * wamp - t * 0.8 - drift)
  );
  float n = fbm(p * 1.4 + warp * (1.3 + u_storm * 0.9) - t * 0.4);
  float energy = 0.6 + u_v * 0.9 + u_storm * 1.5;

  vec3 cA = hue2rgb(u_hue) * 0.17;
  vec3 cB = hue2rgb(u_hue + 36.0) * 0.32;
  vec3 col = cA * smoothstep(0.28, 0.85, n) * energy;
  float ridge = pow(max(n - 0.52, 0.0) / 0.48, 2.0);
  col += cB * ridge * energy;

  float dm = distance(uv * asp, u_m * asp);
  col += hue2rgb(u_hue) * 0.05 * exp(-dm * dm * 5.0);

  float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5)));
  col *= mix(0.55, 1.0, vig);
  col += vec3(0.85, 0.9, 1.0) * u_flash * 0.22 * (0.4 + 0.6 * n);
  gl_FragColor = vec4(col, 1.0);
}
`

export default function AuroraGL() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      preserveDrawingBuffer: true,
    })
    if (!gl) return
    const reduced = prefersReducedMotion()

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('aurora shader:', gl.getShaderInfoLog(s))
        return null
      }
      return s
    }
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const U = {
      res: gl.getUniformLocation(prog, 'u_res'),
      t: gl.getUniformLocation(prog, 'u_t'),
      hue: gl.getUniformLocation(prog, 'u_hue'),
      m: gl.getUniformLocation(prog, 'u_m'),
      v: gl.getUniformLocation(prog, 'u_v'),
      storm: gl.getUniformLocation(prog, 'u_storm'),
      flash: gl.getUniformLocation(prog, 'u_flash'),
    }

    let raf = 0
    let running = false
    let hue = 245
    let vel = 0
    let storm = 0
    let stormUntil = 0
    let flash = 0
    let vt = 0
    let lastNow = performance.now()
    let lastScroll = window.scrollY
    const mouse = { x: 0.5, y: 0.5 }
    const t0 = performance.now()

    const resize = () => {
      const scale = 0.5
      canvas.width = Math.max(2, Math.floor(window.innerWidth * scale))
      canvas.height = Math.max(2, Math.floor(window.innerHeight * scale))
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const activeHue = () => {
      const H = window.innerHeight
      let active = 'top'
      for (const id of Object.keys(SECTION_HUES)) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top < H * 0.5 && r.bottom > H * 0.35) active = id
      }
      return SECTION_HUES[active]
    }

    const draw = (now) => {
      const dt = Math.min(64, now - lastNow)
      lastNow = now
      const dy = Math.abs(window.scrollY - lastScroll)
      lastScroll = window.scrollY
      vel = Math.min(1, vel * 0.965 + dy / 200)
      const stormTarget = now < stormUntil ? 1 : 0
      storm += (stormTarget - storm) * 0.055
      vt += dt * (1 + storm * 3)
      if (storm > 0.4 && Math.random() < 0.025) flash = 1
      flash *= 0.86
      hue += (activeHue() + Math.sin(vt / 450) * 38 * storm - hue) * 0.05
      gl.uniform2f(U.res, canvas.width, canvas.height)
      gl.uniform1f(U.t, vt / 1000)
      gl.uniform1f(U.hue, hue)
      gl.uniform2f(U.m, mouse.x, 1.0 - mouse.y)
      gl.uniform1f(U.v, vel)
      gl.uniform1f(U.storm, storm)
      gl.uniform1f(U.flash, flash)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now) => {
      draw(now)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!running && !reduced) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const onMove = (e) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = e.clientY / window.innerHeight
    }
    const onStorm = () => {
      stormUntil = performance.now() + 9000
    }
    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduced) {
      draw(t0 + 1)
    } else {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('aurora:storm', onStorm)
      document.addEventListener('visibilitychange', onVisibility)
      start()
    }
    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('aurora:storm', onStorm)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} className="aurora-canvas" aria-hidden="true" />
}
