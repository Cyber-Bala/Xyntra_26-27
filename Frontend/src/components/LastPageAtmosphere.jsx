import { useEffect, useRef } from "react";
import horseImage from "../assets/horse-atmosphere.png";

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_scroll;
  uniform vec2 u_pointer;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(17.1, 9.7);
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = v_uv - 0.5;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    uv.x *= aspect;

    vec2 pointer = (u_pointer - 0.5) * vec2(0.45, 0.32);
    float time = u_time * 0.22;
    float scrollBend = u_scroll * 0.18;

    vec2 p = uv;
    p -= pointer;

    // Slow fluid drift.
    p.x += 0.13 * sin(p.y * 3.2 + time) + 0.035 * sin(p.y * 11.0 - time * 1.7);
    p.y += 0.10 * cos(p.x * 2.6 - time * 0.8) + scrollBend * sin(p.x * 2.0);

    float n = fbm(p * 2.35 + vec2(time * 0.55, -time * 0.32));
    float n2 = fbm(p * 5.0 - vec2(time * 0.32, time * 0.25));

    // The central "void" where the orange light is trapped.
    vec2 coreP = p - vec2(0.05 + 0.06 * sin(time * 0.8), -0.03);
    float coreDist = length(coreP * vec2(1.10, 0.88));

    float cavity = smoothstep(0.46, 0.15, coreDist + (n - 0.5) * 0.20);
    float shell = smoothstep(0.34, 0.07, abs(coreDist - (0.24 + n * 0.10)));

    // Thin streaks make the glow feel like it is escaping the cavity.
    float angle = atan(coreP.y, coreP.x);
    float radial = pow(max(0.0, 1.0 - coreDist * 1.75), 2.0);
    float streakWave = 0.5 + 0.5 * sin(angle * 7.0 + n * 7.0 - time * 2.0);
    float streaks = pow(streakWave, 7.0) * radial;

    // A smaller moving ember drifting away from the main pocket.
    vec2 emberP = p - vec2(
      0.34 + 0.05 * sin(time * 1.3),
      0.02 + 0.08 * cos(time * 0.9)
    );
    float ember = smoothstep(0.18, 0.0, length(emberP + vec2(0.03 * sin(time * 2.1), 0.0)));

    float light = cavity * (0.34 + 0.82 * n2) + shell * 0.22 + streaks * 0.38 + ember * 0.34;
    light *= smoothstep(0.98, 0.12, length(uv) * 0.84);

    // Fine particulate halo.
    float grain = noise(v_uv * u_resolution.xy * 0.035 + time * 1.4);
    light += max(0.0, grain - 0.72) * 0.12 * (0.6 + n);

    vec3 deep = vec3(0.055, 0.012, 0.003);
    vec3 hot = vec3(1.0, 0.22, 0.035);
    vec3 orange = mix(deep, hot, smoothstep(0.0, 1.0, n * 1.18));

    float alpha = clamp(light * 0.70, 0.0, 0.76);
    gl_FragColor = vec4(orange * light, alpha);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || "WebGL shader compilation failed.");
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || "WebGL program linking failed.");
  }

  return program;
}

export default function LastPageAtmosphere() {
  const canvasRef = useRef(null);
  const shellRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;

    if (!canvas || !shell) return undefined;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      shell.classList.add("no-webgl");
      return undefined;
    }

    let program;

    try {
      program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    } catch (error) {
      console.error(error);
      shell.classList.add("no-webgl");
      return undefined;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
      ]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const scrollLocation = gl.getUniformLocation(program, "u_scroll");
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let width = 0;
    let height = 0;
    let frameId = 0;
    let startTime = performance.now();
    let scrollTarget = 0;
    let scrollValue = 0;
    let pointerTargetX = 0.5;
    let pointerTargetY = 0.5;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let destroyed = false;

    const resize = () => {
      const rect = shell.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, width, height);
    };

    const updateScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const documentHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollTarget = Math.min(1, Math.max(0, scrollTop / documentHeight));
    };

    const updatePointer = (event) => {
      pointerTargetX = event.clientX / Math.max(window.innerWidth, 1);
      pointerTargetY = 1 - event.clientY / Math.max(window.innerHeight, 1);
    };

    const frame = (now) => {
      if (destroyed) return;

      const elapsed = (now - startTime) / 1000;
      scrollValue += (scrollTarget - scrollValue) * 0.055;
      pointerX += (pointerTargetX - pointerX) * 0.045;
      pointerY += (pointerTargetY - pointerY) * 0.045;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(scrollLocation, scrollValue);
      gl.uniform2f(pointerLocation, pointerX, pointerY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      const image = imageRef.current;
      if (image) {
        const x = (pointerX - 0.5) * 20;
        const y = (scrollValue - 0.5) * -26;
        image.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.025)`;
      }

      frameId = requestAnimationFrame(frame);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(shell);
    resize();
    updateScroll();

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });

    frameId = requestAnimationFrame(frame);

    return () => {
      destroyed = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="last-page-atmosphere" ref={shellRef} aria-hidden="true">
      <canvas ref={canvasRef} className="last-page-atmosphere__canvas" />

      <div className="last-page-atmosphere__mist" />

      <img
        ref={imageRef}
        src={horseImage}
        className="last-page-atmosphere__horse"
        alt=""
        draggable="false"
      />

      <div className="last-page-atmosphere__veil" />
    </div>
  );
}
