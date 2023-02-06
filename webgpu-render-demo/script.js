// Clear color for GPURenderPassDescriptor
const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };

// Vertex data for triangle
// Each vertex has 8 values representing position and color: X Y Z W R G B A

const vertices = new Float32Array([
    0.0,  0.6, 0, 1, 1, 0, 0, 1,
   -0.5, -0.6, 0, 1, 0, 1, 0, 1,
    0.5, -0.6, 0, 1, 0, 0, 1, 1
]);

// Vertex and fragment shaders

const shaders = `
struct VertexOut {
    @builtin(position) position : vec4<f32>,
    @location(0) color : vec4<f32>
}

@vertex
fn vertex_main(@location(0) position: vec4<f32>,
                 @location(1) color: vec4<f32>) -> VertexOut
{
  var output : VertexOut;
  output.position = position;
  output.color = color;
  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4<f32>
{
  return fragData.color;
}
`;

// Main function

async function init() {
    // 1: request adapter and device
    if (!navigator.gpu) {
        throw Error('WebGPU not supported.');
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw Error('Couldn\'t request WebGPU adapter.');
    }
    
    const adapterInfo = await adapter.requestAdapterInfo([]);
    console.log(adapterInfo);

    const device = await adapter.requestDevice();
    if (!device) {
        throw Error('Couldn\'t request WebGPU logical device.');
    }

    // 2: Create a shader module from the shaders template literal
    const shaderModule = device.createShaderModule({
        code: shaders
    });

    // 3: Get reference to the canvas to render on
    const canvas = document.querySelector('#gpuCanvas');
    const context = canvas.getContext('webgpu');

    // Configure swap chain, link the GPU to the canvas
    context.configure({
        device: device,
        format: 'bgra8unorm',
        alphaMode: 'premultiplied'
    });

    // 4: Create vertex buffer to contain vertex data
    const vertexBuffer = device.createBuffer({
        size: vertices.byteLength, // make it big enough to store vertices in
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true // mapped at creation
        });

    // Store mapped range of vertex buffer in a typed array, then copy the triangle vertex data into it
    new Float32Array(vertexBuffer.getMappedRange()).set(vertices);

    // Unmap the vertex buffer; we are done changing it, and the new contents are automatically copied to the GPU
    vertexBuffer.unmap();

    // 5: Create a GPUVertexBufferLayout and GPURenderPipelineDescriptor to provide a definition of our render pipline
    const vertexBuffers = [{
        attributes: [{
            shaderLocation: 0, // position
            offset: 0,
            format: 'float32x4'
        }, {
            shaderLocation: 1, // color
            offset: 16,
            format: 'float32x4'
        }],
        arrayStride: 32,
        stepMode: 'vertex'
    }];

    const pipelineDescriptor = {
        vertex: {
            module: shaderModule,
            entryPoint: 'vertex_main',
            buffers: vertexBuffers
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fragment_main',
            targets: [{
            format: 'bgra8unorm'
            }]
        },
        primitive: {
            topology: 'triangle-list'
        },
        layout: 'auto'
    };

    // 6: Create the actual render pipline

    const renderPipeline = device.createRenderPipeline(pipelineDescriptor);
    
    

    // 7: Create GPUCommandEncoder to issue commands to the GPU
    // Note: render pass descriptor, command encoder, etc. are destroyed after use, fresh one needed for each frame.
    const commandEncoder = device.createCommandEncoder();

    // 8: Create GPURenderPassDescriptor to tell WebGPU which texture to draw into, then initiate render pass

    const renderPassDescriptor = {
        colorAttachments: [{
            clearValue: clearColor,
            loadOp: 'clear',
            storeOp: 'store',
            view: context.getCurrentTexture().createView()
        }]
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    
    // 9: Draw the triangle

    passEncoder.setPipeline(renderPipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.draw(3);

    // End the render pass
    passEncoder.end();

    // 10: End frame by passing array of command buffers to command queue for execution
    device.queue.submit([commandEncoder.finish()]);
}

init();