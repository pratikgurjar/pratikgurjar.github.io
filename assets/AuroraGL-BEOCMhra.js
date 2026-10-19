import{r as C,p as D,j as N}from"./index-r8FIDed6.js";const P={top:245,about:243,experience:254,project:264,skills:234,recognition:248,certifications:252,writing:258,contact:272},G=`
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`,O=`
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
`;function W(){const g=C.useRef(null);return C.useEffect(()=>{const n=g.current,e=n.getContext("webgl",{alpha:!1,antialias:!1,depth:!1,preserveDrawingBuffer:!0});if(!e)return;const w=D(),_=(t,s)=>{const r=e.createShader(t);return e.shaderSource(r,s),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("aurora shader:",e.getShaderInfoLog(r)),null)},x=_(e.VERTEX_SHADER,G),b=_(e.FRAGMENT_SHADER,O);if(!x||!b)return;const o=e.createProgram();e.attachShader(o,x),e.attachShader(o,b),e.linkProgram(o),e.useProgram(o);const I=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,I),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const A=e.getAttribLocation(o,"p");e.enableVertexAttribArray(A),e.vertexAttribPointer(A,2,e.FLOAT,!1,0,0);const i={res:e.getUniformLocation(o,"u_res"),t:e.getUniformLocation(o,"u_t"),hue:e.getUniformLocation(o,"u_hue"),m:e.getUniformLocation(o,"u_m"),v:e.getUniformLocation(o,"u_v"),storm:e.getUniformLocation(o,"u_storm"),flash:e.getUniformLocation(o,"u_flash")};let u=0,l=!1,m=245,h=0,a=0,E=0,d=0,v=0,L=performance.now(),y=window.scrollY;const c={x:.5,y:.5},Y=performance.now(),p=()=>{n.width=Math.max(2,Math.floor(window.innerWidth*.5)),n.height=Math.max(2,Math.floor(window.innerHeight*.5)),n.style.width=`${window.innerWidth}px`,n.style.height=`${window.innerHeight}px`,e.viewport(0,0,n.width,n.height)},j=()=>{const t=window.innerHeight;let s="top";for(const r of Object.keys(P)){const f=document.getElementById(r);if(!f)continue;const H=f.getBoundingClientRect();H.top<t*.5&&H.bottom>t*.35&&(s=r)}return P[s]},R=t=>{const s=Math.min(64,t-L);L=t;const r=Math.abs(window.scrollY-y);y=window.scrollY,h=Math.min(1,h*.965+r/200);const f=t<E?1:0;a+=(f-a)*.055,v+=s*(1+a*3),a>.4&&Math.random()<.025&&(d=1),d*=.86,m+=(j()+Math.sin(v/450)*38*a-m)*.05,e.uniform2f(i.res,n.width,n.height),e.uniform1f(i.t,v/1e3),e.uniform1f(i.hue,m),e.uniform2f(i.m,c.x,1-c.y),e.uniform1f(i.v,h),e.uniform1f(i.storm,a),e.uniform1f(i.flash,d),e.drawArrays(e.TRIANGLES,0,3)},S=t=>{R(t),u=requestAnimationFrame(S)},F=()=>{!l&&!w&&(l=!0,u=requestAnimationFrame(S))},M=()=>{l=!1,cancelAnimationFrame(u)},U=t=>{c.x=t.clientX/window.innerWidth,c.y=t.clientY/window.innerHeight},T=()=>{E=performance.now()+9e3},B=()=>{document.hidden?M():F()};return p(),window.addEventListener("resize",p),w?R(Y+1):(window.addEventListener("pointermove",U,{passive:!0}),window.addEventListener("aurora:storm",T),document.addEventListener("visibilitychange",B),F()),()=>{M(),window.removeEventListener("resize",p),window.removeEventListener("pointermove",U),window.removeEventListener("aurora:storm",T),document.removeEventListener("visibilitychange",B)}},[]),N.jsx("canvas",{ref:g,className:"aurora-canvas","aria-hidden":"true"})}export{W as default};
