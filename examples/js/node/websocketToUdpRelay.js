import { s, pixels, helpers } from '../../../lib/index.js'

import { Buffer } from 'buffer'
import * as dgram from 'dgram'

// Implement the old require function
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// Now you can require whatever
const WebSocket = require('ws')
const http = require('http');
const url = require('url');
const { parse } = require('querystring');
const compress = require('brotli/compress')
const concatArrayBuffers = require('arraybuffer-concat');

let options = {
  serverOptions: {
    //The ip & port for sending incoming websocket packets via udp
    udpTargetIp: "localhost",
    udpTargetPort: "1234"
  },
  leds: {
    pixelAmount: 10,
    ledType: "rgb",
    outputType: "hex",
    protocol: "pixels",
  },
  compression: {
    enabled: false,
    mode: 0,
    quality: 11,
    lgwin: 22
  },
    protocol: {
        s: {
            maxPacketSize: 1470,
            header: {
                version: 4,
                downstreamFlag: true,
                compressedFlag: false,
                type: 1
            },
            message: {
                nodeId: 23,
                session: 25
            },
        },
        pixels: {
          type: 'rgb',
            syncWord: 0,
            channelNumber: 0
        },
    },
  stats: {
    packetSizes: [],
    payloadBeforeCompression: 0,
    payloadAfterCompression: 0,
    frameSize: 0
  }
}

const getFrame = (pixelData) => {
    const payload = options.protocol.s.header.compressedFlag ? compress(pixelData, options.compression)  : pixelData
     if(!payload) {
         console.log('no payload; skipping frame')
         return []
     }
    const pixelsData = pixels.getFrame(Object.assign(options.protocol.pixels, {payload: payload}))
    const sData = s.getFrame(Object.assign(options.protocol.s, {payload: pixelsData}));
    const packets = options.leds.protocol === "pixels" ? [pixelsData] : sData;
    options.stats.packetSizes = packets.reduce((acc,frame) => {
      acc =  [...acc, frame.byteLength]
      return acc
    },[])
    options.stats.payloadBeforeCompression = pixelData.byteLength
    options.stats.payloadAfterCompression = payload.byteLength
    options.stats.frameSize = options.stats.packetSizes.reduce((acc, size) => acc + size)
    return packets
}

const handleSetOptions = (payload) => {
    const result = setOptions(payload)
    return {result: result, options: options}
}

const handleGetStats = (payload) => {
    return {result: true, stats: options.stats}
}

const serverActions = {
    setOptions: handleSetOptions,
    getStats: handleGetStats
}


const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'POST') {
      let body = ''
      const action = url.parse(req.url,true).query.action
      req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
      req.on('end', () => {
        const payload = JSON.parse(body)
        const actionResult = serverActions[action] ? serverActions[action](payload) : {result: false}
        res.end(JSON.stringify(actionResult))
      });

  }
  else {
    res.end(`
            <!doctype html>
            <html>
            <body>
                <h1>Listening for POST Requests on this port...</h1>
            </body>
            </html>
        `);
  }
});

server.listen(3002);


const wss = new WebSocket.Server({ port: 8080 })

const setOptions = (newOptions = {}) => {
  if(typeof newOptions !== "object") {
    return false
  }
  options = {...options, ...newOptions}
  return  true
}

wss.on('connection', function(ws) {
  //Create a udp socket for this websocket connection
  const udpServer = dgram.createSocket('udp4')

  //When a message is received from udp server send it to the ws client
  udpServer.on('message', function(msg, rinfo) {
    console.log(`UDP server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
    ws.send(msg.toString())
  })

  udpServer.on('error', err => {
    console.log(`UDP server error:\n${err.stack}`)
    udpServer.close()
  })

  udpServer.on('listening', () => {
    const address = udpServer.address()
    console.log(`UDP server listening ${address.address}:${address.port}`)
  })

  //When a message is received from ws client send it to udp server.
  ws.on('message', function(message) {
    const msgBuff = new Buffer(message)
    const packets = getFrame(new Uint8Array(msgBuff))
    let fullFrame = packets.reduce(packet => {}, new Uint8Array())
    ws.send(concatArrayBuffers(...packets))
    packets.map(packet => {
      udpServer.send(new Uint8Array(packet), 0, packet.byteLength, options.serverOptions.udpTargetPort, options.serverOptions.udpTargetIp)
    });
  })
})

