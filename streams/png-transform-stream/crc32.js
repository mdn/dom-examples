/**
 * This file contains the logic to create CRC32 checksums for PNG chunks.
 */


// Initialize CRC Table
const CRC_TABLE = createCrcTable();

/**
 * Create the initial CRC table needed to calculate the checksums.
 *
 * @return {number[]} An array containing hashes.
 */
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

/**
 * Calculates a CRC32 checksum of a PNG chunk.
 *
 * @param {string} chunkName The name of the chunk to calculate the CRC for.
 * @param {ArrayBuffer} chunkData The data to calculate the CRC for.
 * @return {number} The calculated CRC checksum.
 */
function crc32(chunkName, chunkData) {
  const uint8Array = new Uint8Array(chunkData.byteLength + 4);
  uint8Array.set(chunkName.split('').map(str => str.charCodeAt(0)), 0);
  uint8Array.set(new Uint8Array(chunkData), 4);

  let crc = 0 ^ (-1);

  for (const byte of uint8Array) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xFF];
  }

  return (crc ^ (-1)) >>> 0;
}
