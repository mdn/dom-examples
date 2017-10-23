// Initialize CRC Table
const CRC_TABLE = createCrcTable();

function createCrcTable() {
  const crcTable = [];
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
  }

  return crcTable;
}

function crc32(uint8Array) {
  let crc = 0 ^ (-1);

  for (const byte of uint8Array) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xFF];
  }

  return (crc ^ (-1)) >>> 0;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

class PngGrayScaleStreamSource {
  /**
   * @param {ReadableStream} rs
   */
  constructor(rs) {
    this._rs = rs;
    this._mode = 'magic';
  }

  /**
   * @param {ReadableStreamDefaultController} controller
   */
  start(controller) {
    const reader = this._rs.getReader();
    this._pump(controller, reader, new Uint8Array(0)).then((value) => {
      let position = value.byteOffset;
      let length = value.byteLength;
      const source = new DataView(value.buffer, position, length);
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
            const chunkName = this._readString(source, position, 4);
            this._writeString(target, position, chunkName);
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

            const bitDepth = source.getUint8(position);
            target.setUint8(position, bitDepth);
            position += 1;
            console.log('%cPNG bit depth: %c %d', 'font-weight: bold', '', bitDepth);

            const colorType = source.getUint8(position);
            target.setUint8(position, colorType);
            position += 1;
            console.log('%cPNG color type:%c %s', 'font-weight: bold', '', this._colorType(colorType));

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

            const chunkName = this._readString(source, position + 4, 4);
            if (chunkName !== 'IDAT') {
              throw new TypeError('PNG is missing IDAT chunk');
            }

            const crcStart = position + 4;

            // Extract the data from the PNG stream
            const bytesPerCol = 4;
            const bytesPerRow = this._width * bytesPerCol + 1;
            let result = value.subarray(position + 8, position + 8 + dataSize);

            // Decompress the data
            result = pako.inflate(result);

            // Remove PNG filters from each scanline
            result = this._removeFilters(result, bytesPerCol, bytesPerRow);

            // Actually grayscale the image
            result = this._grayscale(result, bytesPerCol, bytesPerRow);

            // Compress with Deflate
            result = pako.deflate(result);

            // Write data to target
            target.setUint32(position, result.byteLength);
            this._writeString(target, position + 4, 'IDAT');
            buffer.set(result, position + 8);

            position += result.byteLength + 8;

            const chunkCrc = crc32(new Uint8Array(target.buffer, crcStart, position - crcStart));
            target.setUint32(position, chunkCrc);
            position += 4;

            this._mode = 'end';
            break;
          }
          case 'end': {
            // Write IEND chunk
            target.setUint32(position, 0);
            position += 4;
            this._writeString(target, position, "IEND");
            position += 4;
            target.setUint32(position, 2923585666);
            position += 4;

            controller.enqueue(buffer.subarray(0, position));
            controller.close();
            return;
          }
        }
      }
    });
  }

  cancel(reason) {
    return this._rs.cancel(reason);
  }

  /**
   * @param {ReadableStreamDefaultController} controller
   * @param {ReadableStreamDefaultReader} reader
   * @param {Uint8Array} uint8Array
   */
  _pump(controller, reader, uint8Array) {
    return reader.read().then(({ value, done }) => {
      if (done) {
        return uint8Array;
      }

      const newArray = new Uint8Array(uint8Array.length + value.length);
      newArray.set(uint8Array);
      newArray.set(value, uint8Array.length);
      return this._pump(controller, reader, newArray);
    }).catch((err) => console.error(err));
  }

  /**
   * @param {DataView} dataView
   * @param {number} position
   * @param {number} length
   */
  _readString(dataView, position, length) {
    return new Array(length)
      .fill(0)
      .map((e, index) => String.fromCharCode(dataView.getUint8(position + index))).join('');
  }

  /**
   * @param {DataView} dataView
   * @param {number} position
   * @param {string} string
   */
  _writeString(dataView, position, string) {
    string.split('').forEach((char, index) => dataView.setUint8(position + index, char.charCodeAt(0)));
  }

  _colorType(number) {
    switch (number) {
      case 0: return 'grayscale';
      case 2: return 'rgb';
      case 3: return 'palette';
      case 4: return 'grayscale-alpha';
      case 6: return 'rgb-alpha';
    }
  }

  _removeFilters(src, bytesPerCol, bytesPerRow) {
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

  _grayscale(src, bytesPerCol, bytesPerRow) {
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
