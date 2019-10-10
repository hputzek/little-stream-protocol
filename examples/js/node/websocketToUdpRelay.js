import { Buffer } from 'buffer'
import * as dgram from 'dgram'
// Implement the old require function
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// Now you can require whatever
const WebSocket = require('ws')
const http = require('http');
const { parse } = require('querystring');

let options = {
  //The ip & port for sending incoming websocket packets via udp
  udpTargetIp:'localhost',
  udpTargetPort: 1234
}


const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
      req.on('end', () => {
        const newOptions = JSON.parse(body)
        const result = setOptions(newOptions)
        res.end(JSON.stringify({result: result, options: options}));
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
  console.log(newOptions)
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
    console.log(message)
    const msgBuff = new Buffer(message)
    udpServer.send(msgBuff, 0, msgBuff.length, options.udpTargetPort, options.udpTargetIp)
  })
})

