/**
 * This file contains logic to grayscale a PNG from a ReadableStream.
 */


/**
 * Remove Paeth filter from three data points.
 */
function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;

  return c;
}


/**
 * A transformer of a TransformStream to create a grayscale PNG.
 */
class GrayscalePNGTransformer {
  constructor() {
    this._mode = 'magic';
  }

  /**
   * Called for every downloaded PNG data chunk to be grayscaled.
   *
   * @param {Uint8Array} chunk The downloaded chunk.
   * @param {TransformStreamDefaultController} controller The controller to euqueue grayscaled data.
   */
  transform(chunk, controller) {
    let position = chunk.byteOffset;
    let length = chunk.byteLength;
    const source = new DataView(chunk.buffer, position, length);
    const buffer = new Uint8Array(length);
    const target = new DataView(buffer.buffer, position, length);

    while (position < length) {
      switch (this._mode) {
        case 'magic': {
          const magic1 = source.getUint32(position);
          target.setUint32(position, magic1);
          position += 4;

          const magic2 = source.getUint32(position);
          target.setUint32(position, magic2);
          position += 4;

          const magic = magic1.toString(16) + '0' + magic2.toString(16);
          console.log('%cPNG magic:     %c %o', 'font-weight: bold', '', magic);
          if (magic !== '89504e470d0a1a0a') {
            throw new TypeError('This is not a PNG');
          }

          this._mode = 'header';
          break;
        }
        case 'header': {
          // Read chunk info
          const chunkLength = source.getUint32(position);
          target.setUint32(position, chunkLength);
          position += 4;
          const chunkName = this.readString(source, position, 4);
          this.writeString(target, position, chunkName);
          position += 4;
          if (chunkName !== 'IHDR') {
            throw new TypeError('PNG is missing IHDR chunk');
          }

          // Read image dimensions
          this._width = source.getUint32(position);
          target.setUint32(position, this._width);
          position += 4;
          this._height = source.getUint32(position);
          target.setUint32(position, this._height);
          position += 4;
          console.log('%cPNG dimensions:%c %d x %d', 'font-weight: bold', '', this._width, this._height);

          this._bitDepth = source.getUint8(position);
          target.setUint8(position, this._bitDepth);
          position += 1;
          console.log('%cPNG bit depth: %c %d', 'font-weight: bold', '', this._bitDepth);

          this._colorType = source.getUint8(position);
          target.setUint8(position, this._colorType);
          position += 1;
          console.log('%cPNG color type:%c %s', 'font-weight: bold', '', this.colorType(this._colorType));

          const compression = source.getUint8(position);
          target.setUint8(position, compression);
          position += 1;
          console.log('%cPNG compressio:%c %d', 'font-weight: bold', '', compression);
          const filter = source.getUint8(position);
          target.setUint8(position, filter);
          position += 1;
          console.log('%cPNG filter:    %c %d', 'font-weight: bold', '', filter);
          const interlace = source.getUint8(position);
          target.setUint8(position, interlace);
          position += 1;
          console.log('%cPNG interlace: %c %d', 'font-weight: bold', '', interlace);

          const chunkCrc = source.getUint32(position);
          target.setUint32(position, chunkCrc);
          position += 4;

          this._mode = 'data';
          break;
        }
        case 'data': {
          // Read chunk info
          const dataSize = source.getUint32(position);
          console.log('%cPNG data size: %c %d', 'font-weight: bold', '', dataSize);

          const chunkName = this.readString(source, position + 4, 4);
          if (chunkName !== 'IDAT') {
            throw new TypeError('PNG is missing IDAT chunk');
          }

          const crcStart = position + 4;

          // Extract the data from the PNG stream
          const bytesPerCol = this.bytesPerPixel();
          const bytesPerRow = this._width * bytesPerCol + 1;
          let result = chunk.subarray(position + 8, position + 8 + dataSize);

          // Decompress the data
          result = pako.inflate(result);

          // Remove PNG filters from each scanline
          result = this.removeFilters(result, bytesPerCol, bytesPerRow);

          // Actually grayscale the image
          result = this.grayscale(result, bytesPerCol, bytesPerRow);

          // Compress with Deflate
          result = pako.deflate(result);

          // Write data to target
          target.setUint32(position, result.byteLength);
          this.writeString(target, position + 4, 'IDAT');
          buffer.set(result, position + 8);

          position += result.byteLength + 8;

          const chunkCrc = crc32(chunkName, result);
          target.setUint32(position, chunkCrc);
          position += 4;

          this._mode = 'end';
          break;
        }
        case 'end': {
          // Write IEND chunk
          target.setUint32(position, 0);
          position += 4;
          this.writeString(target, position, 'IEND');
          position += 4;
          target.setUint32(position, 2923585666);
          position += 4;

          controller.enqueue(buffer.subarray(0, position));
          return;
        }
      }
    }
  }

  /**
   * @param {DataView} dataView
   * @param {number} position
   * @param {number} length
   */
  readString(dataView, position, length) {
    return new Array(length)
      .fill(0)
      .map((e, index) => String.fromCharCode(dataView.getUint8(position + index))).join('');
  }

  /**
   * @param {DataView} dataView
   * @param {number} position
   * @param {string} string
   */
  writeString(dataView, position, string) {
    string.split('').forEach((char, index) => dataView.setUint8(position + index, char.charCodeAt(0)));
  }

  /**
   * Retrieves the PNG's color type.
   *
   * @param {number} number A number representing the color type.
   * @return {string} A string naming the color type.
   */
  colorType(number) {
    switch (number) {
      case 0: return 'grayscale';
      case 2: return 'rgb';
      case 3: return 'palette';
      case 4: return 'grayscale-alpha';
      case 6: return 'rgb-alpha';
    }
  }

  /**
   * Returns the number of bytes to read per pixel.
   *
   * @return {number}
   */
  bytesPerPixel() {
    if (this._bitDepth < 8) {
      throw new Error('Bit depths below 8 bit are currently not supported.');
    }

    const byteDepth = this._bitDepth / 8;
    if (this._colorType === 0) {
      return byteDepth;
    }
    if (this._colorType === 2) {
      return 3 * byteDepth;
    }
    if (this._colorType === 3) {
      return byteDepth;
    }
    if (this._colorType === 4) {
      return 2 * byteDepth;
    }

    return 4 * byteDepth;
  }

  removeFilters(src, bytesPerCol, bytesPerRow) {
    const dest = src.slice();
    for (let y = 0, i = y * bytesPerRow; y < this._height; y += 1, i = y * bytesPerRow) {
      const filter = src[i];
      dest[i] = 0;
      i++;
      if (filter === 1) {
        // Sub filter
        for (let x = 0, j = i; x < this._width; x += 1, j += bytesPerCol) {
          dest[j]     = src[j]     + dest[j     - bytesPerCol];
          dest[j + 1] = src[j + 1] + dest[j + 1 - bytesPerCol];
          dest[j + 2] = src[j + 2] + dest[j + 2 - bytesPerCol];
          dest[j + 3] = src[j + 3] + dest[j + 3 - bytesPerCol];
        }
      } else if (filter === 2) {
        // Up filter
        for (let x = 0, j = i; x < this._width; x += 1, j += bytesPerCol) {
          dest[j]     = src[j]     + dest[j     - bytesPerRow];
          dest[j + 1] = src[j + 1] + dest[j + 1 - bytesPerRow];
          dest[j + 2] = src[j + 2] + dest[j + 2 - bytesPerRow];
          dest[j + 3] = src[j + 3] + dest[j + 3 - bytesPerRow];
        }
      } else if (filter === 3) {
        // Average filter
        for (let x = 0, j = i; x < this._width; x += 1, j += bytesPerCol) {
          dest[j]     = src[j]     + Math.trunc((dest[j     - bytesPerCol] + dest[j     - bytesPerRow]) / 2);
          dest[j + 1] = src[j + 1] + Math.trunc((dest[j + 1 - bytesPerCol] + dest[j + 1 - bytesPerRow]) / 2);
          dest[j + 2] = src[j + 2] + Math.trunc((dest[j + 2 - bytesPerCol] + dest[j + 2 - bytesPerRow]) / 2);
          dest[j + 3] = src[j + 3] + Math.trunc((dest[j + 3 - bytesPerCol] + dest[j + 3 - bytesPerRow]) / 2);
        }
      } else if (filter === 4) {
        // Paeth filter
        for (let x = 0, j = i; x < this._width; x += 1, j += bytesPerCol) {
          dest[j]     = src[j]     + paeth(dest[j     - bytesPerCol], dest[j     - bytesPerRow], dest[j     - bytesPerCol - bytesPerRow]);
          dest[j + 1] = src[j + 1] + paeth(dest[j + 1 - bytesPerCol], dest[j + 1 - bytesPerRow], dest[j + 1 - bytesPerCol - bytesPerRow]);
          dest[j + 2] = src[j + 2] + paeth(dest[j + 2 - bytesPerCol], dest[j + 2 - bytesPerRow], dest[j + 2 - bytesPerCol - bytesPerRow]);
          dest[j + 3] = src[j + 3] + paeth(dest[j + 3 - bytesPerCol], dest[j + 3 - bytesPerRow], dest[j + 3 - bytesPerCol - bytesPerRow]);
        }
      }
    }
    return dest;
  }

  grayscale(src, bytesPerCol, bytesPerRow) {
    const dest = src.slice();
    for (let y = 0, i = y * bytesPerRow; y < this._height; y += 1, i = y * bytesPerRow) {
      const filter = src[i];
      if (filter === 0) {
        i++;
        for (let x = 0, j = i; x < this._width; x += 1, j += bytesPerCol) {
          const red   = src[j];
          const green = src[j + 1];
          const blue  = src[j + 2];

          const gray = Math.trunc((red + green + blue) / 3);
          dest[j    ] = gray;
          dest[j + 1] = gray;
          dest[j + 2] = gray;
        }
      }
    }
    return dest;
  }
}
