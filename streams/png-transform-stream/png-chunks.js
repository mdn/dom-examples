/**
 * This file contains definitions for the PNG format's chunk types.
 */


/**
 * Defines a property on an object reading and
 * writing its data from or to a DataView.
 */
function defineDataViewProperty(object, name, dataView, bits, offset) {
  const getter = `getUint${bits}`;
  const setter = `setUint${bits}`;
  Object.defineProperty(object, name, {
    enumerable: true,
    get() {
      return dataView[getter](offset);
    },
    set(value) {
      return dataView[setter](offset, value);
    },
  })
}

/**
 * A generic PNG chunk with a chunk name and data.
 */
class PNGChunk {
  constructor({ name, data }) {
    this.name = name;
    this.data = data;
    Object.defineProperty(this, 'data', {
      enumerable: false,
      writable: true,
      value: data,
    });
    Object.defineProperty(this, 'chunkCrc', {
      enumerable: true,
      get() {
        return crc32(this.name, this.data);
      }
    });
    Object.defineProperty(this, 'chunkLength', {
      enumerable: true,
      get() {
        return this.data.byteLength;
      }
    });
  }
}

/**
 * The first chunk of a PNG containing the PNG's metadata.
 */
class IHDRChunk extends PNGChunk {
  constructor({ data }) {
    super({ name: 'IHDR', data });
    const dv = new DataView(data);
    defineDataViewProperty(this, 'width', dv, 32, 0);
    defineDataViewProperty(this, 'height', dv, 32, 4);
    defineDataViewProperty(this, 'bitDepth', dv, 8, 8);
    defineDataViewProperty(this, 'colorType', dv, 8, 9);
    defineDataViewProperty(this, 'compression', dv, 8, 10);
    defineDataViewProperty(this, 'filter', dv, 8, 11);
    defineDataViewProperty(this, 'interlace', dv, 8, 12);
  }
}

/**
 * A data chunk.
 */
class IDATChunk extends PNGChunk {
  constructor({ data }) {
    super({ name: 'IDAT', data });
  }
}

/**
 * The final chunk in a PNG indicating the PNG's ending.
 */
class IENDChunk extends PNGChunk {
  constructor({ data }) {
    super({ name: 'IEND', data });
  }
}

/**
 * A text chunk containing arbitrary string data.
 */
class tEXtChunk extends PNGChunk {
  constructor({ data }) {
    super({ name: 'tEXt', data });
    Object.defineProperty(this, 'key', {
      enumerable: true,
      get() {
        return String.fromCharCode(...new Uint8Array(this.data)).split(`\0`, 2)[0];
      },
      set(key) {
        const str = `${key}\0${this.value}`;
        const from = Uint8Array.from(str.split('').map(s => s.charCodeAt(0)));
        this.data = from.buffer;
      },
    });
    Object.defineProperty(this, 'value', {
      enumerable: true,
      get() {
        return String.fromCharCode(...new Uint8Array(this.data)).split(`\0`, 2)[1];
      },
      set(value) {
        const str = `${this.key}\0${value}`;
        const from = Uint8Array.from(str.split('').map(s => s.charCodeAt(0)));
        this.data = from.buffer;
      },
    });
  }
}

/**
 * The sRGB chunk containing information about the PNG's sRGB profile.
 */
class sRGBChunk extends PNGChunk {
  constructor({ data }) {
    super({ name: 'sRGB', data });
    const values = [
      'perceptual',
      'relative colorimetric',
      'saturation',
      'absolute colorimetric',
    ];
    const dv = new DataView(data);
    Object.defineProperty(this, 'value', {
      enumerable: true,
      get() {
        return values[dv.getUint8(0)];
      },
      set(value) {
        const index = values.indexOf(value);
        if (index === -1) throw new TypeError(`Invalid sRGB value: ${value}`);
        dv.setUint8(0, index);
      },
    });
  }
}

/**
 * A bKGD chunk containing the PNG's background color.
 */
class bKGDChunk extends PNGChunk {
  constructor({ data }) {
    super({ name: 'bKGD', data });
    const dv = new DataView(data);
    if (data.byteLength === 1) {
      defineDataViewProperty(this, 'paletteColor', dv, 8, 0);
    } else if (data.byteLength === 2) {
      defineDataViewProperty(this, 'gray', dv, 16, 0);
    } else {
      defineDataViewProperty(this, 'red', dv, 16, 0);
      defineDataViewProperty(this, 'green', dv, 16, 2);
      defineDataViewProperty(this, 'blue', dv, 16, 4);
    }
  }
}

/**
 * A pHYs chunk containing physical pixel dimensions.
 */
class pHYsChunk extends PNGChunk {
  constructor({ data }) {
    super({ name: 'pHYs', data });
    const dv = new DataView(data);
    defineDataViewProperty(this, 'pixelsPerUnitX', dv, 32, 0);
    defineDataViewProperty(this, 'pixelsPerUnitY', dv, 32, 4);
    defineDataViewProperty(this, 'unit', dv, 8, 8);
  }
}

/**
 * A tIME chunk gives the time of the last image modification.
 */
class tIMEChunk extends PNGChunk {
  constructor({ data }) {
    super({ name: 'tIME', data });
    const dv = new DataView(data);
    defineDataViewProperty(this, 'year', dv, 16, 0);
    defineDataViewProperty(this, 'month', dv, 8, 2);
    defineDataViewProperty(this, 'day', dv, 8, 3);
    defineDataViewProperty(this, 'hour', dv, 8, 4);
    defineDataViewProperty(this, 'minute', dv, 8, 5);
    defineDataViewProperty(this, 'second', dv, 8, 6);
  }
}

/**
 * Function to create a PNG chunk from its name and data.
 *
 * @param {string} name The PNG chunk's name.
 * @param {ArrayBuffer} data The PNG chunk's data.
 * @return {PNGChunk} An instance representing the PNG chunk.
 */
function createChunk({ name, data }) {
  switch (name) {
    case 'IHDR':
      return new IHDRChunk({ data });
    case 'IDAT':
      return new IDATChunk({ data });
    case 'IEND':
      return new IENDChunk({ data });
    case 'tEXt':
      return new tEXtChunk({ data });
    case 'sRGB':
      return new sRGBChunk({ data });
    case 'bKGD':
      return new bKGDChunk({ data });
    case 'pHYs':
      return new pHYsChunk({ data });
    case 'tIME':
      return new tIMEChunk({ data });
    default:
      return new PNGChunk({ name, data });
  }
}
