// A spinning cube with an HTML element as the texture on every face,
// using WebGL and HTML-in-Canvas

main();

function main() {
  const canvas = document.querySelector("#gl-canvas");
  const source = document.querySelector("form");

  const gl = canvas.getContext("webgl2", { alpha: false });
  if (!gl) {
    alert("WebGL 2 is not supported by your browser.");
    return;
  }
  if (typeof gl.texElementSubImage2D !== "function") {
    alert(
      "texElementSubImage2D() is not available. HTML-in-Canvas is not supported.",
    );
    return;
  }

  // ---------------------------------------------------------------------
  // Shaders (GLSL ES 3.00)
  // ---------------------------------------------------------------------
  const vertexShaderSource = `#version 300 es
    in vec3 aPosition;
    in vec2 aUV;
    uniform mat4 uMVP;
    out vec2 vUV;

    void main() {
      vUV = aUV;
      gl_Position = uMVP * vec4(aPosition, 1.0);
    }
  `;

  const fragmentShaderSource = `#version 300 es
    precision mediump float;
    in vec2 vUV;
    uniform sampler2D uTexture;
    out vec4 outColor;

    void main() {
      outColor = texture(uTexture, vUV);
    }
  `;

  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aUV = gl.getAttribLocation(program, "aUV");
  const uMVP = gl.getUniformLocation(program, "uMVP");
  const uTexture = gl.getUniformLocation(program, "uTexture");

  // ---------------------------------------------------------------------
  // Geometry: interleaved position (vec3) + uv (vec2), plus an index buffer,
  // captured in a vertex array object
  // ---------------------------------------------------------------------
  const { vertices, indices, faces } = createCubeGeometry();

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 5 * 4, 0);
  gl.enableVertexAttribArray(aUV);
  gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 5 * 4, 3 * 4);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);

  // ---------------------------------------------------------------------
  // Render state
  // ---------------------------------------------------------------------
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.clearColor(0, 0, 0, 1);

  // ---------------------------------------------------------------------
  // The texture that receives the HTML element
  // ---------------------------------------------------------------------
  const elementTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, elementTexture);
  // No mipmaps: linear filtering with clamped edges (also required for
  // non-power-of-two textures in WebGL 1).
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let texWidth = 0;
  let texHeight = 0;

  // Copies the latest snapshot of the element into the texture,
  // (re)allocating the texture storage if the element's size has changed.
  // Returns false if the element has no usable size yet.
  function updateElementTexture() {
    // Size in canvas-grid pixels.
    const scale = canvas.width / canvas.clientWidth;
    const w = Math.ceil(source.offsetWidth * scale);
    const h = Math.ceil(source.offsetHeight * scale);
    if (!(w > 0 && h > 0)) return false;

    gl.bindTexture(gl.TEXTURE_2D, elementTexture);

    // texElementSubImage2D() doesn't allocate storage, so pre-allocate it
    // (only when the size changes).
    if (w !== texWidth || h !== texHeight) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA8,
        w,
        h,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      texWidth = w;
      texHeight = h;
    }

    gl.texElementSubImage2D(gl.TEXTURE_2D, 0, 0, 0, source);
    return true;
  }

  // ---------------------------------------------------------------------
  // Pause the spin while the pointer is over the canvas or the form has focus
  // ---------------------------------------------------------------------
  let pointerOver = false;
  canvas.addEventListener("pointerenter", () => {
    pointerOver = true;
  });
  canvas.addEventListener("pointerleave", () => {
    pointerOver = false;
  });
  const isPaused = () => pointerOver || source.matches(":focus-within");

  // ---------------------------------------------------------------------
  // Render loop, driven by the `paint` event
  // ---------------------------------------------------------------------
  const projection = perspective(
    (45 * Math.PI) / 180,
    canvas.width / canvas.height,
    0.1,
    100.0,
  );
  const view = translation(0, 0, -6);
  let rotation = 0;
  let then = null;
  let geometrySet = false;

  canvas.addEventListener("paint", () => {
    // No snapshot exists until the first paint, and the element may not have
    // a usable size yet, so skip drawing but keep the loop alive.
    if (!updateElementTexture()) {
      canvas.requestPaint();
      return;
    }

    const paused = isPaused();

    // `then` is updated every frame, even while paused, so the cube
    // resumes smoothly instead of jumping ahead.
    const now = performance.now() * 0.001; // convert to seconds
    if (then !== null && !paused) {
      rotation += now - then;
    }
    then = now;

    const model = multiply(
      rotateZ(rotation),
      multiply(rotateY(rotation * 0.7), rotateX(rotation * 0.3)),
    );
    const mvp = multiply(projection, multiply(view, model));

    // While paused, tell the browser where the form appears on the cube so
    // that hit testing matches what is rendered. Release it when spinning
    // resumes.
    if (paused) {
      canvas.updateElementGeometry(source, {
        canvasTransform: elementToCanvasTransform(
          mvp,
          model,
          view,
          faces,
          source.offsetWidth,
          source.offsetHeight,
          canvas.clientWidth,
          canvas.clientHeight,
        ),
      });
      geometrySet = true;
    } else if (geometrySet) {
      canvas.clearElementGeometry(source);
      geometrySet = false;
    }

    // Draw
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, elementTexture);
    gl.uniform1i(uTexture, 0);
    gl.uniformMatrix4fv(uMVP, false, mvp);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    canvas.requestPaint(); // request the next paint
  });
}

// --- Shader helpers ------------------------------------------------------
function compileShader(gl, type, sourceText) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, sourceText);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(
    program,
    compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource),
  );
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

// --- Cube geometry -------------------------------------------------------
// Each face is described by its outward normal `n`, and the `r` (right) and
// `u` (up) directions as seen from outside the cube. Corners are generated
// as n + s*r + t*u, with uv (0,0) at the top-left of the face, so that the
// top row of the element's texture lands at the top of every face.
function createCubeGeometry() {
  const faces = [
    { n: [0, 0, 1], r: [1, 0, 0], u: [0, 1, 0] }, // front
    { n: [0, 0, -1], r: [-1, 0, 0], u: [0, 1, 0] }, // back
    { n: [0, 1, 0], r: [1, 0, 0], u: [0, 0, -1] }, // top
    { n: [0, -1, 0], r: [1, 0, 0], u: [0, 0, 1] }, // bottom
    { n: [1, 0, 0], r: [0, 0, -1], u: [0, 1, 0] }, // right
    { n: [-1, 0, 0], r: [0, 0, 1], u: [0, 1, 0] }, // left
  ];
  // [s, t, u, v] for top-left, top-right, bottom-right, bottom-left
  const corners = [
    [-1, 1, 0, 0],
    [1, 1, 1, 0],
    [1, -1, 1, 1],
    [-1, -1, 0, 1],
  ];

  const vertices = [];
  const indices = [];
  faces.forEach(({ n, r, u }, f) => {
    for (const [s, t, uu, vv] of corners) {
      vertices.push(
        n[0] + s * r[0] + t * u[0],
        n[1] + s * r[1] + t * u[1],
        n[2] + s * r[2] + t * u[2],
        uu,
        vv,
      );
    }
    const b = f * 4;
    // Counter-clockwise as seen from outside: TL, BL, BR / TL, BR, TR
    indices.push(b, b + 3, b + 2, b, b + 2, b + 1);
  });

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    faces,
  };
}

// --- Hit-test geometry ---------------------------------------------------
// Builds the DOMMatrix that maps the element's CSS-pixel box onto the
// on-screen quad of the cube face that is most squarely facing the camera,
// for use with canvas.updateElementGeometry().
//
//   result = viewport * mvp * elementToFace
//
// The viewport step sits before the perspective divide, so the browser
// performs the divide when it applies the matrix.
function elementToCanvasTransform(
  mvp,
  model,
  view,
  faces,
  elW,
  elH,
  canvasW,
  canvasH,
) {
  // Pick the face whose normal points most directly at the camera
  let best = faces[0];
  let bestScore = -Infinity;
  for (const face of faces) {
    const [nx, ny, nz] = face.n;
    // Rotated normal (model is rotation-only, so this is also the face centre)
    const cx = model[0] * nx + model[4] * ny + model[8] * nz;
    const cy = model[1] * nx + model[5] * ny + model[9] * nz;
    const cz = model[2] * nx + model[6] * ny + model[10] * nz;
    // Face centre in view space (camera at origin)
    const vx = cx + view[12];
    const vy = cy + view[13];
    const vz = cz + view[14];
    const score = -(cx * vx + cy * vy + cz * vz) / Math.hypot(vx, vy, vz);
    if (score > bestScore) {
      bestScore = score;
      best = face;
    }
  }
  const { n, r, u } = best;

  // Element pixels -> model space. (0,0) is the face's top-left corner,
  // (elW,elH) the bottom-right; element z maps along the face normal so the
  // matrix stays invertible.
  const toFace = new Float32Array([
    (2 * r[0]) / elW,
    (2 * r[1]) / elW,
    (2 * r[2]) / elW,
    0,
    (-2 * u[0]) / elH,
    (-2 * u[1]) / elH,
    (-2 * u[2]) / elH,
    0,
    n[0],
    n[1],
    n[2],
    0,
    n[0] - r[0] + u[0],
    n[1] - r[1] + u[1],
    n[2] - r[2] + u[2],
    1,
  ]);

  // Clip space -> canvas CSS pixels (y flipped), applied before the w divide
  const hw = canvasW / 2;
  const hh = canvasH / 2;
  const viewport = new Float32Array([
    hw,
    0,
    0,
    0,
    0,
    -hh,
    0,
    0,
    0,
    0,
    1,
    0,
    hw,
    hh,
    0,
    1,
  ]);

  const m = multiply(viewport, multiply(mvp, toFace));
  return new DOMMatrix(Array.from(m)); // 16 values, column-major
}

// --- Minimal column-major 4x4 matrix helpers -----------------------------
// WebGL clip space has z in [-1, 1] (WebGPU uses [0, 1]), so this is the
// standard OpenGL-style perspective matrix.
function perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) * nf,
    -1,
    0,
    0,
    2 * far * near * nf,
    0,
  ]);
}

function translation(x, y, z) {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
}

function rotateX(a) {
  const c = Math.cos(a),
    s = Math.sin(a);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}

function rotateY(a) {
  const c = Math.cos(a),
    s = Math.sin(a);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
}

function rotateZ(a) {
  const c = Math.cos(a),
    s = Math.sin(a);
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

// Returns a * b (column-major).
function multiply(a, b) {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[col * 4 + k];
      out[col * 4 + row] = sum;
    }
  }
  return out;
}
