/**
 * creates a simple 8bit XOR checksum for a given array buffer
 * @param buffer
 * @returns {number}
 */
export const getChecksumFromArrayBuffer = buffer => {
  const bufferView = new DataView(buffer, 0)
  let crc = 0
  for (let i = 0; i < buffer.byteLength; i++) {
    crc = crc ^ bufferView.getUint8(i)
  }
  return crc
}
