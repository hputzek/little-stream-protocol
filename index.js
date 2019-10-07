const defaultOptions = {
    header: {
        test: 'hello world',
        version: 1,
        downstreamFlag: true,
        compressedFlag: false,
        type: 1
    },
    message: {
        nodeId: '',
        session: '',
        frame: '',
        fragment: ''
    },
    firstFragment: {
        byteLength: 1,
        checksum: 234
    }
}

export const sendFrame = (frameOptions) => {
    const options = {...defaultOptions, ...frameOptions}
    console.log(options.header.test)
}
