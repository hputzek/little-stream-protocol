const defaultOptions = {
  header: {
    version: 4,
    downstreamFlag: true,
    compressedFlag: false,
    type: 1
  },
  message: {
    nodeId: 1,
    session: 1,
    data: null,
    fragment: 0
  },
  firstFragment: {
    byteLength: 1,
    checksum: 234
  }
};

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

export const getFrameData = frameOptions => {
  const buffer = new ArrayBuffer(8);
  const bufferView = new DataView(buffer);
  const options = { ...defaultOptions, ...frameOptions };

  bufferView.setUint8(0,getHeader(options));
  console.log(bufferView);
};
