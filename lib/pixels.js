import { getChecksumFromArrayBuffer } from './helpers.js'

/**
 * This function adds the header payload for a frame to a given DataView
 * @see https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/DataView
 * @param settings object
 * @param headerDataView DataView
 */
const setHeaderData = (settings, headerDataView) => {
  headerDataView.setUint8(0, settings.headerData.identifier)
  headerDataView.setUint8(1, settings.headerData.syncWord)
  headerDataView.setUint8(2, settings.headerData.channelNumber)
  headerDataView.setUint16(3, settings.data.length, true)
}

/**
 * creates a binary frame according to the pixels protocol
 * @see https://github.com/IoTPanic/pixels
 *
 * @param options
 * @returns {ArrayBuffer}
 */
export const getFrame = options => {
  const settings = Object.assign(
    {
      type: 'rgb',
      headerData: {
        // The first byte indicates what kind of payload is arriving. 'p' stands for 'pixels' in this case
        identifier: 'P'.charCodeAt(0),
        // sync word, this is to verify the right client is connected and the right mode is on
        syncWord: 0,
        // channel Number to send the payload to
        channelNumber: 0
      },
      payload: []
    },
    options
  )

  // flatten payload to allow for nested arrays
  settings.data = settings.payload.flat()

  const HEADER_SIZE = 5 // How many bytes does the header need?
  const MESSAGE_SIZE = settings.data.length
  const BUFFER_SIZE = settings.data.length + HEADER_SIZE + 1 // calculate how big the buffer must be
  const buffer = new ArrayBuffer(BUFFER_SIZE)

  const header = new DataView(buffer, 0, HEADER_SIZE)
  const message = new DataView(
    buffer,
    HEADER_SIZE,
    MESSAGE_SIZE
  )
  setHeaderData(settings, header)
  // put pixel values into message
  settings.data.map((value, index) => {
    message.setUint8(index, parseInt(value))
  })

  const crc = new DataView(buffer, BUFFER_SIZE - 1, 1)
  crc.setUint8(0, getChecksumFromArrayBuffer(buffer))
  // return the whole frame payload (header + message)
  return buffer
}
