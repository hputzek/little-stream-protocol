const defaultOptions = {
  payload: null,
  maxPacketSize: 1470,
  header: {
    version: 4,
    downstreamFlag: true,
    compressedFlag: false,
    type: 1
  },
  message: {
    nodeId: 23,
    session: 25,
    frame: 230,
    fragment: 0
  },
  firstFragment: {
    byteLength: 1,
    checksum: 234
  }
};

let frameCount = 0;

const GENERAL_HEADER = 8;
const MESSAGE_HEADER = 32;
const FIRST_FRAME_HEADER = 24;

/**
 * Returns the header for a frame
 * @param options
 * @returns {number}
 */
const getHeader = options => {
  const headerData = parseInt(
    options.header.version.toString(2) +
      (options.header.downstreamFlag | 0) +
      (options.header.compressedFlag | 0) +
      options.header.type.toString(2),
    2
  );
  return headerData;
};

/**
 * Chunks a given array buffer into several array Buffers with a maximum length of len
 * @param arr
 * @param len
 * @returns {[]}
 */
const chunkArrayBuffer = (arr, len) => {
  var chunks = [],
    i = 0,
    n = arr.byteLength;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
};

/**
 * creates a simple 8bit XOR checksum for a given array buffer
 * @param buffer
 * @returns {number}
 */
const getChecksumFromArrayBuffer = buffer => {
  const bufferView = new DataView(buffer, 0);
  let crc = 0;
  for (let i = 0; i < buffer.byteLength; i++) {
    crc = crc ^ bufferView.getUint8(i);
  }
  console.log(crc);
  return crc;
};

/**
 * Returns an Array of ArrayBuffers where each buffer represents
 * a binary frame ready to be sent via udp
 * @param frameOptions
 * @return Array
 */
export const getFrameData = frameOptions => {
  const options = { ...defaultOptions, ...frameOptions };
  const payload = options.payload;
  const fragmentedMessages = chunkArrayBuffer(
    payload,
    options.maxPacketSize - GENERAL_HEADER - MESSAGE_HEADER - FIRST_FRAME_HEADER
  );

  const output = fragmentedMessages.map((message, index) => {
    const isFirstFragment = () => index === 0;
    const HEADER_SIZE = isFirstFragment()
      ? GENERAL_HEADER + MESSAGE_HEADER + FIRST_FRAME_HEADER
      : GENERAL_HEADER + MESSAGE_HEADER;
    const messageBuffer = new ArrayBuffer(message.byteLength + HEADER_SIZE + 1);

    const headerView = new DataView(messageBuffer, 0, HEADER_SIZE);
    headerView.setUint8(0, getHeader(options));
    headerView.setUint8(1, options.message.nodeId);
    headerView.setUint8(2, options.message.session);
    headerView.setUint8(3, frameCount);
    headerView.setUint8(4, index);
    if (isFirstFragment()) {
      headerView.setUint16(5, messageBuffer.byteLength, true);
      headerView.setUint8(7, getChecksumFromArrayBuffer(payload));
    }

    const payloadView = new DataView(
      messageBuffer,
      HEADER_SIZE / 8,
      message.byteLength
    );

    const payloadArray = new Uint8Array(message)
    for(let i = 0; i < payloadArray.length; i++) {
      payloadView.setUint8(i, payloadArray[i])
    }
    return messageBuffer;
  });
  frameCount++;
  return output;
};
