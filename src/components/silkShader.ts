/** Full-screen triangle, no buffers needed (WebGL2 gl_VertexID). */
export const VERTEX = /* glsl */ `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

/**
 * Midnight backdrop with flowing ribbons made of fine champagne threads.
 * Each ribbon's width is a signed sine, so the threads cross over and the ribbon
 * appears to twist in 3D. A sheen travels along it and a silk body is lit from above.
 */
export const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uIntro;
uniform float uDpr;
uniform vec2 uMouse;
uniform vec3 uBgTop;
uniform vec3 uBgBottom;
uniform vec3 uGlowCool;
uniform vec3 uGlowWarm;
uniform vec3 uGoldDeep;
uniform vec3 uGoldLight;

out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 ribbon(vec2 p, float t, float base, float slope, float width, float seed, float strength) {
  float x = p.x;
  float c = base + slope * x
          + 0.085 * sin(x * 1.7 + t * 0.32 + seed)
          + 0.040 * sin(x * 3.3 - t * 0.24 + seed * 2.3);
  float w = width * sin(x * 1.15 - t * 0.21 + seed * 1.7)
          + width * 0.22 * sin(x * 2.6 + t * 0.29 + seed);
  float aw = abs(w) + 0.002;
  float facing = smoothstep(0.0, width, aw);

  float px = uDpr / uRes.y;
  float threads = 0.0;
  const int N = 30;
  for (int i = 0; i < N; i++) {
    float k = float(i) / float(N - 1) * 2.0 - 1.0;
    float d = abs(p.y - (c + k * w));
    float core = 1.0 - smoothstep(0.0, px * 1.4, d);
    float halo = exp(-(d * d) / (px * px * 16.0)) * 0.18;
    threads += (core + halo) * (1.0 - 0.55 * k * k);
  }
  threads *= mix(0.22, 0.75, facing);

  float rel = (p.y - c) / aw;
  float inside = 1.0 - smoothstep(0.9, 1.0, abs(rel));
  float lit = 0.5 + 0.5 * rel * sign(w);
  float body = inside * facing * (0.05 + 0.10 * lit);

  float sheen = pow(0.5 + 0.5 * sin(x * 2.1 - t * 0.55 + seed + uMouse.x * 0.8), 8.0);

  float energy = (threads * (0.55 + 1.1 * sheen) + body * (0.6 + 1.4 * sheen)) * strength;
  vec3 tint = mix(uGoldDeep, uGoldLight, clamp(0.25 + sheen * 0.75 + facing * 0.15, 0.0, 1.0));
  return tint * energy;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  vec2 p = (frag - 0.5 * uRes) / uRes.y;
  float t = uTime;

  vec3 col = mix(uBgBottom, uBgTop, smoothstep(-0.55, 0.6, p.y));
  vec2 g1 = p - vec2(-0.35, 0.55);
  vec2 g2 = p - vec2(0.65, -0.4);
  col += uGlowCool * 0.35 * exp(-dot(g1, g1) * 3.0);
  col += uGlowWarm * 0.30 * exp(-dot(g2, g2) * 3.5);

  vec2 q = p + vec2(0.0, uMouse.y * 0.015);

  float ease = 1.0 - pow(1.0 - uIntro, 3.0);
  float front = mix(-1.4, 1.6, ease);
  float reveal = 1.0 - smoothstep(front - 0.35, front, p.x);

  float e = length((p - vec2(0.0, 0.02)) / vec2(0.60, 0.30));
  float calm = mix(0.28, 1.0, smoothstep(0.55, 1.2, e));

  vec3 rib = ribbon(q, t, -0.30, 0.20, 0.15, 0.0, 1.0)
           + ribbon(q, t * 0.8, -0.38, 0.27, 0.09, 2.4, 0.45)
           + ribbon(q, t * 0.9, 0.52, -0.24, 0.10, 4.1, 0.38);
  rib = 1.0 - exp(-rib * 1.25);
  col += rib * reveal * calm;

  vec2 v = uv - 0.5;
  col *= 1.0 - 0.6 * dot(v, v);

  col += (hash(frag + fract(t)) - 0.5) * (1.5 / 255.0);
  outColor = vec4(col, 1.0);
}`
