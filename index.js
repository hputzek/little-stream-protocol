import { s, pixels } from '../lib/index.js'

/**
 * We need a test payload, this is what this function provides
 * Returns a flat array with r,g,b(,w) values from 0 to 255
 * @param pixelAmount
 * @param type
 */
const getRandomPixelData = (pixelAmount, type) => {
  const bytesPerPixel = type === 'rgbw' ? 4 : 3
  return Uint8Array.from({ length: pixelAmount * bytesPerPixel }, () =>
    Math.floor(Math.random() * 255)
  )
}

/**
 * Create a test payload with 800 pixels = 800 x r,g,b  which sums up to 2400 Uint8 values
 * @type {Uint8Array}
 */
const testPayload = getRandomPixelData(800, 'rgb')

/**
 * get pixel encoded output
 *
 * For available parameters please look at the default options in the 'getFrame' function
 * @type {ArrayBuffer}
 */
const pixelsOnly = pixels.getFrame({ payload: testPayload })

/**
 * get s encoded output
 * For available parameters please look at the default options in the 'getFrame' function
 *
 * This is also an example for how to use parameters for the protocol settings / flags
 * @type {ArrayBuffer}
 */
const sOnly = s.getFrame({
  payload: testPayload.buffer,
  header: { version: 7 }
})

// get output from pixels + s combined
const pixelsPlusS = s.getFrame({
  payload: pixels.getFrame({ payload: testPayload })
})

// log the results to console
console.log('pixels only:')
console.log(pixelsOnly)
console.log('s only')
console.log(sOnly)
console.log('pixels + s')
console.log(pixelsPlusS)
