import { pixels, s } from '../lib/index.js'
import { getRandomPixelData } from '../lib/helpers.js'
import * as dgram from 'dgram'

const settings = {
  ip: '',
  port: 1234,
  testPayloadSize: 800
}
/**
 * Create a test payload with 800 pixels = 800 x r,g,b  which sums up to 2400 Uint8 values
 * @type {Uint8Array}
 */
const testPayload = Uint8Array.from(
  getRandomPixelData(settings.testPayloadSize, 'rgb')
)

console.log(`Payload byte length: ${testPayload.byteLength}`)

/**
 * Create one frame of output from pixels + s
 */
const pixelsPlusSFrame = s.getFrame({
  // you can set options listed in 'lib/s.js' and 'lib/pixels.js' to overwrite their default settings
  payload: pixels.getFrame({ payload: testPayload })
})

//Create a udp socket for this websocket connection
const udp = dgram.createSocket('udp4')
// pixelsPlusS is an array which contains 1-x packets
pixelsPlusSFrame.map(packet => {
  console.log(packet)
  console.log(new Uint8Array(packet)) // uncomment one of the logs and use the one you prefer
  udp.send(new Uint8Array(packet), 0, packet.byteLength, 1234, '192.168.87.28')
})
process.exit()
