const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentSource = `
precision mediump float;

uniform sampler2D uBrush;
uniform float uProgress;
uniform vec2 uImageScale;
varying vec2 vUv;

// A clustered threshold keeps the leading edge like ink catching on paper.
float threshold(vec2 pixel) {
  vec2 cell = mod(floor(pixel), 4.0);
  vec2 low = mod(cell, 2.0);
  vec2 high = floor(cell * 0.5);
  float coarse = 2.0 * low.x + 3.0 * low.y - 4.0 * low.x * low.y;
  float fine = 2.0 * high.x + 3.0 * high.y - 4.0 * high.x * high.y;
  return (4.0 * coarse + fine) / 16.0 - 0.5;
}

void main() {
  vec2 uv = (vUv - 0.5) * uImageScale + 0.5;
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float front = mix(-0.22, 1.22, uProgress);
  float distanceToEdge = front - uv.x + (uv.y - 0.5) * 0.24;
  float grit = threshold(gl_FragCoord.xy / 1.5) * 0.13;
  float exposed = smoothstep(-0.017, 0.024, distanceToEdge + grit);
  vec4 ink = texture2D(uBrush, uv);
  gl_FragColor = vec4(ink.rgb, ink.a * exposed);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function link(gl: WebGLRenderingContext) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (program && vertex && fragment) {
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
  }
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (program && gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
}

export function createInkRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
  if (!gl) return null;

  const program = link(gl);
  const texture = gl.createTexture();
  const vertices = gl.createBuffer();
  const dispose = () => {
    gl.deleteBuffer(vertices);
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
  };
  if (!program || !texture || !vertices) {
    dispose();
    return null;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  } catch {
    dispose();
    return null;
  }
  if (gl.getError() !== gl.NO_ERROR) {
    dispose();
    return null;
  }

  const progressLocation = gl.getUniformLocation(program, 'uProgress');
  const imageScale = gl.getUniformLocation(program, 'uImageScale');
  const imageAspect = image.naturalWidth / image.naturalHeight;

  return {
    draw(progress: number) {
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      const aspect = width / height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(imageScale, Math.max(1, aspect / imageAspect), Math.max(1, imageAspect / aspect));
      gl.uniform1f(progressLocation, progress);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose,
  };
}
