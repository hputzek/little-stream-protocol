import { pixels, s } from '../lib/index.js'
import { getRandomPixelData } from '../lib/helpers.js'
import * as dgram from 'dgram'

const settings = {
  ip: '',
  port: 1234,
  testPayloadSize: 800 // led count
}

//Create a udp socket
const udp = dgram.createSocket('udp4')
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
const createPixelsPlusSFrame = payload =>
  s.getFrame({
    // you can set options listed in 'lib/s.js' and 'lib/pixels.js' to overwrite their default settings
    payload: pixels.getFrame({ payload: payload })
  })

const logOutput = pixelsPlusSFrame => {
  // pixelsPlusS is an array which contains 1-x packets
  console.log(
    ` ------- Frame number ${new Uint8Array(pixelsPlusSFrame[0])[3]} ------`
  )
  pixelsPlusSFrame.map((packet, index) => {
    //console.log(packet) // uncomment one of the logs and use the one you prefer
    const payload = new Uint8Array(packet)
    const debugObject = {
      header: payload[0],
      nodeId: payload[1],
      session: payload[2],
      frame: payload[3],
      fragment: payload[4]
    }
    if (index === 0) {
      debugObject.byteLength = [payload[5], payload[7]]
      debugObject.checksum = payload[7]
    }
    console.log(debugObject)
    // console.log(`[Fragment ${index}] -> ${new Uint8Array(packet)}`)
    udp.send(
      new Uint8Array(packet),
      0,
      packet.byteLength,
      1234,
      '192.168.87.28'
    )
  })
}

// send three frames
logOutput(createPixelsPlusSFrame(testPayload))
logOutput(createPixelsPlusSFrame(testPayload))
logOutput(createPixelsPlusSFrame(testPayload))

process.exit()
