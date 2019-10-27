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

/**
 *  returns a test payload of random rgb(w) values
 * @param pixelAmount
 * @param ledType
 * @returns {number[]}
 */
export const getRandomPixelData = (pixelAmount, ledType) => {
  const bytesPerPixel = ledType === 'rgbw' ? 4 : 3
  return Array.from({ length: pixelAmount * bytesPerPixel }, () =>
    Math.floor(Math.random() * 255)
  )
}

/**
 * https://www.freecodecamp.org/news/pipe-and-compose-in-javascript-5b04004ac937/
 * @param fns
 * @returns {function(*=): *}
 */
export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

/**
 * https://www.freecodecamp.org/news/pipe-and-compose-in-javascript-5b04004ac937/
 * @param fns
 * @returns {function(*=): *}
 */
export const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

/**
 * The saturation is the colorfulness of a color relative to its own brightness.
 * @param red
 * @param green
 * @param blue
 * @returns {number}
 */
export const getSaturation = ({ red = 0, green = 0, blue = 0 } = {}) => {
  // Find the smallest of all three parameters.
  const low = Math.min(red, Math.min(green, blue))
  // Find the highest of all three parameters.
  const high = Math.max(red, Math.max(green, blue))
  // The difference between the last two variables
  // divided by the highest is the saturation.
  return Math.round(100 * ((high - low) / high))
}

/**
 * Returns the value of White
 * @param red
 * @param green
 * @param blue
 * @returns {{red: *, green: *, blue: *, white: *}}
 */
export const addWhiteChannel = ({ red = 0, green = 0, blue = 0 } = {}) => {
  return {
    red,
    green,
    blue,
    white: parseInt(
      (((255 - getSaturation({ red, green, blue })) / 255) *
        (red + green + blue)) /
        3
    )
  }
}

/**
 * Use this function for color correction. It corrects the highest possible value for each channel
 * @param red
 * @param green
 * @param blue
 * @param white
 * @param maxRed
 * @param maxGreen
 * @param maxBlue
 * @returns {{red: *, green: *, blue: *, white: *}}
 */
export const addColorCorrection = (
  { red = 0, green = 0, blue = 0, white = 0 } = {},
  { maxRed = 255, maxGreen = 255, maxBlue = 255 } = {}
) => {
  // Set the maximum value for all colors.
  return {
    red: parseInt((red / 255) * maxRed),
    green: parseInt((green / 255) * maxGreen),
    blue: parseInt((blue / 255) * maxBlue),
    white: white
  }
}

/**
 * Use this to set the maximum brightness for all colors
 * @param red
 * @param green
 * @param blue
 * @param white
 * @param percentage
 * @returns {{red: *, green: *, blue: *, white: *}}
 */
export const addDimmer = (
  { red = 0, green = 0, blue = 0, white = 0 } = {},
  percentage = 100
) => {
  const multiplier = percentage / 100
  return {
    red: parseInt(red * multiplier),
    green: parseInt(green * multiplier),
    blue: parseInt(blue * multiplier),
    white: parseInt(white * multiplier)
  }
}
