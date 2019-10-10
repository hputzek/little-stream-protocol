import { s, pixels } from '../lib/index.js'

// generate a test payload
const getRandomPixelData = (pixelAmount, type) => {
  const bytesPerPixel = type === 'rgbw' ? 4 : 3
  return Array.from({ length: pixelAmount * bytesPerPixel }, () =>
    Math.floor(Math.random() * 255)
  )
}

// get frame payload for a given payload
const frames = s.getFrame({
  payload: pixels.getFrame({ payload: getRandomPixelData(5000, 'rgb') })
})

console.log(frames)
