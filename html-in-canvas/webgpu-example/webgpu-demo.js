// A spinning cube with an HTML element as the texture on every face,
// using WebGPU and HTML-in-Canvas

main();

async function main() {
  const canvas = document.querySelector("#gpu-canvas");
  const source = document.querySelector("form");

  if (!navigator.gpu) {
    alert("WebGPU is not supported by your browser.");
    return;
  }
  if (!("drawElementImageToTexture" in GPUQueue.prototype)) {
    alert(
      "GPUQueue.drawElementImageToTexture() is not available. HTML-in-Canvas is not supported.",
    );
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    alert("Unable to get a WebGPU adapter.");
    return;
  }
  const device = await adapter.requestDevice();

  const context = canvas.getContext("webgpu");
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format: canvasFormat, alphaMode: "opaque" });

  // ---------------------------------------------------------------------
  // Shaders (WGSL)
  // ---------------------------------------------------------------------
  const shaderModule = device.createShaderModule({
    code: `
      struct Uniforms {
        mvp : mat4x4f,
      };

      @group(0) @binding(0) var<uniform> uniforms : Uniforms;
      @group(0) @binding(1) var texSampler : sampler;
      @group(0) @binding(2) var faceTexture : texture_2d<f32>;

      struct VertexOutput {
        @builtin(position) position : vec4f,
        @location(0) uv : vec2f,
      };

      @vertex
      fn vertexMain(@location(0) position : vec3f,
                    @location(1) uv : vec2f) -> VertexOutput {
        var output : VertexOutput;
        output.position = uniforms.mvp * vec4f(position, 1.0);
        output.uv = uv;
        return output;
      }

      @fragment
      fn fragmentMain(input : VertexOutput) -> @location(0) vec4f {
        return textureSample(faceTexture, texSampler, input.uv);
      }
    `,
  });

  // ---------------------------------------------------------------------
  // Geometry: interleaved position (vec3) + uv (vec2), plus an index buffer
  // ---------------------------------------------------------------------
  const { vertices, indices, faces } = createCubeGeometry();

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  const indexBuffer = device.createBuffer({
    size: indices.byteLength, // 72 bytes: already a multiple of 4
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(indexBuffer, 0, indices);

  const uniformBuffer = device.createBuffer({
    size: 64, // one mat4x4f
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // ---------------------------------------------------------------------
  // Pipeline, sampler, depth buffer
  // ---------------------------------------------------------------------
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vertexMain",
      buffers: [
        {
          arrayStride: 5 * 4,
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x3" },
            { shaderLocation: 1, offset: 3 * 4, format: "float32x2" },
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fragmentMain",
      targets: [{ format: canvasFormat }],
    },
    primitive: { topology: "triangle-list", cullMode: "back" },
    depthStencil: {
      format: "depth24plus",
      depthWriteEnabled: true,
      depthCompare: "less",
    },
  });

  // No mipmaps: linear filtering with clamped edges.
  const sampler = device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge",
  });

  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: "depth24plus",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  // ---------------------------------------------------------------------
  // The texture that receives the HTML element
  // ---------------------------------------------------------------------
  let elementTexture = null;
  let bindGroup = null;
  let texWidth = 0;
  let texHeight = 0;

  // Copies the latest snapshot of the element into a GPU texture,
  // (re)creating the texture if the element's size has changed.
  // Returns false if the element has no usable size yet.
  function updateElementTexture() {
    // Size in canvas-grid pixels.
    const scale = canvas.width / canvas.clientWidth;
    const w = Math.ceil(source.offsetWidth * scale);
    const h = Math.ceil(source.offsetHeight * scale);
    if (!(w > 0 && h > 0)) return false;

    if (!elementTexture || w !== texWidth || h !== texHeight) {
      elementTexture?.destroy();
      elementTexture = device.createTexture({
        size: [w, h],
        format: "rgba8unorm",
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT,
      });
      bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: uniformBuffer } },
          { binding: 1, resource: sampler },
          { binding: 2, resource: elementTexture.createView() },
        ],
      });
      texWidth = w;
      texHeight = h;
    }

    device.queue.drawElementImageToTexture(
      { source },
      { texture: elementTexture, size: { width: w, height: h } },
    );
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
    device.queue.writeBuffer(uniformBuffer, 0, mvp);

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

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setIndexBuffer(indexBuffer, "uint16");
    pass.drawIndexed(indices.length);
    pass.end();
    device.queue.submit([encoder.finish()]);

    canvas.requestPaint(); // request the next paint
  });
}

// --- Cube geometry -------------------------------------------------------
// Each face is described by its outward normal `n`, and the `r` (right) and
// `u` (up) directions as seen from outside the cube. Corners are generated
// as n + s*r + t*u, with uv (0,0) at the top-left of the face. WebGPU's
// texture origin is also top-left, so the element appears upright and
// un-mirrored on every face, with no flipping needed.
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
// WebGPU clip space has z in [0, 1] (WebGL uses [-1, 1]), so the projection
// matrix differs from the one gl-matrix's perspective() produces.
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
    far * nf,
    -1,
    0,
    0,
    far * near * nf,
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
