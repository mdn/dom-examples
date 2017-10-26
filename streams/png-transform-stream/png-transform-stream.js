/**
 * This file contains a PNGTransformStream which retrieves PNG chunks out of a binary data stream.
 */


/**
 * This class unpacks Uint8Arrays and sends PNG chunks when it gained enough data.
 */
class PNGUnpacker {
  constructor() {
    this.data = new Uint8Array(0);
    this.onChunk = null;
    this.onClose = null;
  }

  /**
   * Adds more binary data to unpack.
   *
   * @param {Uint8Array} uint8Array The data to add.
   */
  addBinaryData(uint8Array) {
    const newData = new Uint8Array(this.data.length + uint8Array.length);
    newData.set(this.data, 0);
    newData.set(uint8Array, this.data.length);
    this.data = newData;

    this.checkForChunks();
  }

  /**
   * Checks whether new chunks can be found within the binary data.
   */
  checkForChunks() {
    if (!this.position) {
      this.position = 8;
    }

    while (true) {
      // Check if stream contains another PNG chunk
      const dataView = new DataView(this.data.buffer, this.position);
      const chunkLength = dataView.getUint32(0);
      if (dataView.byteLength < chunkLength + 12) {
        return;
      }

      // Create a PNG chunk instance out of data retrieved
      const name = String.fromCharCode(dataView.getUint8(4), dataView.getUint8(5), dataView.getUint8(6), dataView.getUint8(7));
      const data = this.data.buffer.slice(this.position + 8, this.position + chunkLength + 8);
      const chunk = createChunk({ name, data });

      // Inform consumer about the found chunk
      if (typeof this.onChunk === 'function') {
        this.onChunk(chunk);
      }

      // Check if found the last chunk within the PNG
      if (name === 'IEND') {
        if (typeof this.onClose === 'function') {
          this.onClose();
          return;
        }
      }

      this.position += chunkLength + 12;
    }
  }
}

/**
 * This transform stream unpacks PNG chunks out of binary data.
 * It can be consumed by a ReadableStream's pipeThrough method.
 */
class PNGTransformStream {
  constructor() {
    const unpacker = new PNGUnpacker();

    this.readable = new ReadableStream({
      start(controller) {
        unpacker.onChunk = chunk => controller.enqueue(chunk);
        unpacker.onClose = () => controller.close();
      }
    });

    this.writable = new WritableStream({
      write(uint8Array) {
        unpacker.addBinaryData(uint8Array);
      }
    });
  }
}
