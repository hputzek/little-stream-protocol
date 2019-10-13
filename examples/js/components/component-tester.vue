<template>
  <form ref="input-form">
      <div style="display: flex;" v-if="!isLocal">
          <div style="font-size: 80px;">🤷‍♀️</div>
          <div>
              <h2>You can test without udp output only</h2>
              <p>You must use this tool on your local machine to send udp data with it.</p>
              <p>Please refer to the <a href="https://github.com/hputzek/little-stream-protocol">GitHub Repo</a> to get info on how to set this up.</p>
          </div>
      </div>
    <fieldset>
      <legend>Protocol</legend>
      <label for="udp-target-ip"
      >Target IP
        <input
                type="text"
                id="udp-target-ip"
                v-model="serverOptions.udpTargetIp"
                @change="saveOptionsToServer"
        />
      </label>
      <label for="udp-target-port">
        Target Port
        <input
                type="number"
                min="1"
                id="udp-target-port"
                v-model="serverOptions.udpTargetPort"
                @change="saveOptionsToServer"
        />
      </label>
      <label for="protocol-pixels"
        >Pixels
        <input
          type="radio"
          id="protocol-pixels"
          name="protocol"
          value="pixels"
          v-model="leds.protocol"
          @change="saveOptionsToServer"
        />
      </label>
      <label for="protocol-pixels+s"
        >Pixels+s
        <input
          type="radio"
          id="protocol-pixels+s"
          name="protocol"
          value="pixels+s"
          v-model="leds.protocol"
          @change="saveOptionsToServer"
        />
      </label>
      <details>
        <summary>pixels settings <a class="help-link" href="https://github.com/IoTPanic/pixels" title="pixels github page">❔</a></summary>
        <label for="pixels-sync-word">
          Sync word
          <input
                  type="number"
                  min="0"
                  max="255"
                  id="pixels-sync-word"
                  v-model="protocol.pixels.syncWord"
                  @change="saveOptionsToServer"
          />
        </label>
        <label for="pixels-channel-number">
          Channel number
          <input
                  type="number"
                  min="0"
                  max="255"
                  id="pixels-channel-number"
                  v-model="protocol.pixels.channelNumber"
                  @change="saveOptionsToServer"
          />
        </label>
      </details>
      <details>
        <summary>s settings<a class="help-link" href="https://iotpanic.github.io" title="s github page">❔</a></summary>
        <label for="protocol-pixels+s-package-size" title="if packet to send is bigger it will be split in fragments">
          Packet size
          <input
                  type="number"
                  min="1"
                  max="5000"
                  id="protocol-pixels+s-package-size"
                  v-model="protocol.s.maxPacketSize"
                  @change="saveOptionsToServer"
          />
        </label>
        <label for="protocol-pixels+s-package-size" title="if packet to send is bigger it will be split in fragments">
          Version
          <input
                  type="number"
                  min="0"
                  max="7"
                  id="protocol-pixels+s-version"
                  v-model="protocol.s.header.version"
                  @change="saveOptionsToServer"
          />
        </label>
        <label for="protocol-pixels+s-downstream" class="highlighted">
          Downstream flag
          <input @change="saveOptionsToServer" v-model="protocol.s.header.downstreamFlag" type="checkbox" id="protocol-pixels+s-downstream"/>
        </label>
        <label for="protocol-pixels+s-type" title="if packet to send is bigger it will be split in fragments">
          Type
          <input
                  type="number"
                  min="0"
                  max="7"
                  id="protocol-pixels+s-type"
                  v-model="protocol.s.header.type"
                  @change="saveOptionsToServer"
          />
        </label>
        <label for="protocol-pixels+s-node-id"
        >Node ID
          <input
                  type="number"
                  min="1"
                  max="255"
                  id="protocol-pixels+s-node-id"
                  v-model="protocol.s.message.nodeId"
                  @change="saveOptionsToServer"
          />
        </label>
        <label for="protocol-pixels+s-node-session"
        >Session
          <input
                  type="number"
                  min="1"
                  max="255"
                  id="protocol-pixels+s-node-session"
                  v-model="protocol.s.message.session"
                  @change="saveOptionsToServer"
          />
        </label>
      </details>
      <label for="compression-checkbox" class="highlighted">
        Brotli compress
        <input @change="saveOptionsToServer" v-model="compression.enabled" type="checkbox" id="compression-checkbox"/>
      </label>
      <details>
        <summary>Brotli settings <a class="help-link" title="brotli.js github page" href="https://github.com/foliojs/brotli.js?files=1" target="_blank">❔</a></summary>

        <label for="compression-quality">
          Quality (0-11)
          <input
                  type="number"
                  min="0"
                  max="11"
                  id="compression-quality"
                  v-model="compression.quality"
                  @change="saveOptionsToServer"
          />
        </label>
        <label for="compression-lgwin">
          lgwin (window size)
          <input
                  type="number"
                  min="0"
                  max="22"
                  id="compression-lgwin"
                  v-model="compression.lgwin"
                  @change="saveOptionsToServer"
          />
        </label>

      </details>
    </fieldset>
    <fieldset>
      <legend>LED's</legend>
      <label class="highlighted">Type</label>
      <label for="type-rgb"
        >RGB
        <input
          type="radio"
          id="type-rgb"
          name="led-type"
          value="rgb"
          v-model="leds.ledType"
          @change="saveOptionsToServer"
      /></label>
      <label for="type-rgbw">RGBW
      <input
        type="radio"
        id="type-rgbw"
        name="led-type"
        value="rgbw"
        v-model="leds.ledType"
        @change="saveOptionsToServer"
      />
      </label>
      <label for="dimmer" class="highlighted">
        Master brightness
        <input
                type="range"
                id="dimmer"
                min="1"
                max="100"
                v-model="leds.masterBrightness"
        />
      </label>
      <label class="highlighted">Number of leds</label>
      <input
              type="range"
              id="pixel-amount-range"
              min="1"
              max="2000"
              v-model="leds.pixelAmount"
              @change="saveOptionsToServer"
      />
      <input
              type="number"
              class="pixel-amount"
              id="pixel-amount"
              v-model="leds.pixelAmount"
              @change="saveOptionsToServer"
      />
    </fieldset>
    <fieldset>
      <legend>Stats</legend>
      <label class="highlighted">Preview as</label>
      <label for="output-hex"
      >HEX<input
              type="radio"
              id="output-hex"
              name="output-type"
              value="hex"
              v-model="leds.outputType"
              @change="saveOptionsToServer"
      /></label>
      <label for="output-int"
      >INT<input
              type="radio"
              id="output-int"
              name="output-type"
              value="int"
              v-model="leds.outputType"
              @change="saveOptionsToServer"
      /></label>
      <p v-if="!binOutput">current packets per Frame: {{ packetCountPerFrame }} </p>

    </fieldset>
      <fieldset class="slider-wrapper">
        <legend>Auto send</legend>

          <input
                  type="range"
                  id="timer-fps"
                  min="1"
                  max="1000"
                  v-model="timer.duration"
                  @change="startTimer"
          />

        <label for="duration-interval">
          Interval
          <input
                  type="number"
                  class="pixel-amount"
                  id="duration-interval"
                  v-model="timer.duration"
                  @change="saveOptionsToServer"
          />
        </label>
        <label for="duration-fps">
          FPS
          <input
                  disabled
                  type="number"
                  class="pixel-amount"
                  id="duration-fps"
                  v-model="timer.duration"
                  @change="saveOptionsToServer"
          />
        </label>

          <button type="button" :class="this.timerIntervalId ? 'active' : ''" @click="toggleTimer">{{timerButtonText}}</button>
          <button type="button" v-if="binOutput" @click="saveFrame">💾 Frame</button>
      </fieldset>
    <textarea v-model="guiOutput"></textarea>
  </form>
</template>
<script>
module.exports = {
  data() {
    return {
      webSocketConn: new WebSocket("ws://localhost:8080"),
      packetCountPerFrame: 0,
      timerIntervalId: null,
      singleFrame: null,
      binOutput: null,
      guiOutput: null,
      leds: {
        pixelAmount: 10,
        ledType: "rgb",
        outputType: "hex",
        protocol: "pixels",
        masterBrightness: 15
      },
      timer: {
        duration: 1000,
      },
      serverOptions: {
        //The ip & port for sending incoming websocket packets via udp
        udpTargetIp: "localhost",
        udpTargetPort: "1234",
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
          syncWord: 0,
          channelNumber: 0
        },
      },
      compression: {
        enabled: false,
        mode: 0,
        quality: 11,
        lgwin: 22
      },
      stats: {
        packetCountPerFrame: 0,
        payloadBeforeCompression: 0,
        payloadAfterCompression: 0
      }
    };
  },
  computed: {
    isLocal: function() {
      return (
        location.hostname === "localhost" || location.hostname === "127.0.0.1"
      );
    },
    timerButtonText: function () {
      return this.timerIntervalId === null ? "Start" : "Stop"
    }
  },
  mounted() {
    // load state from localstorage
    const state = window.testhelpers.loadState('input-form')
    // set initial options
    this.setOptions();
    // output one frame
    this.output()
    Object.keys(state).map(key => this[key] = Object.assign(this[key], state[key]))
    // set handler for receiving messages
    this.webSocketConn.onmessage = async (evt) => {
      const buffer = await evt.data.arrayBuffer()
      const binOutput = new Uint8Array(buffer)
      this.binOutput = binOutput
      this.guiOutput = (this.leds.outputType === "hex") ? this.toHexString(binOutput) : binOutput;

    };
    // set handler to save settings on change
    this.$refs["input-form"].addEventListener('change', ()=>{
      const data = Object.assign({},this.$data)
      const {leds, serverOptions, timer, compression, stats} = data
      window.testhelpers.saveState('input-form', {leds, serverOptions, timer, stats, compression})
    })
  },
  methods: {
    saveOptionsToServer() {
      this.output()
      this.setOptions()
    },
    output() {
      const rawPayload = this.getRandomPixelData(this.leds.pixelAmount, this.leds.ledType)
      // add dimmer...
      const payload = rawPayload.map(channel => {
        return Math.ceil(channel * (this.leds.masterBrightness / 100))
      })

      if (this.webSocketConn.readyState === 1) {
          this.webSocketConn.send(new Uint8Array(payload));
      }
    },
    toggleTimer() {
      if (this.timerIntervalId === null) {
        this.saveOptionsToServer()
        this.output()
        this.startTimer();
      } else {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null
      }
    },
    startTimer() {
      clearInterval(this.timerIntervalId);
      // Store the id of the interval so we can clear it later
      this.timerIntervalId = setInterval(() => {
        this.output();
      }, this.timer.duration);
    },
    // generate a test payload
    getRandomPixelData(pixelAmount, ledType) {
      const bytesPerPixel = ledType === "rgbw" ? 4 : 3;
      return Array.from({ length: pixelAmount * bytesPerPixel }, () =>
        Math.floor(Math.random() * 255)
      );
    },
    toHexString(bytes) {
      return bytes.reduce(
        (str, byte) => str + byte.toString(16).padStart(2, "0") + " ",
        ""
      );
    },
    setOptions() {
      fetch("http://localhost:3002?action=setOptions", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify({serverOptions: this.serverOptions, leds: this.leds, compression: this.compression})
      })
        .then(function(response) {
          return response.json();
        })
        .then(data => {
          if (data.result !== true) {
            alert("Error saving new options to udp relay.");
          }
        });
    },
    saveFrame() {
        window.testhelpers.createAndDownloadBlobFile(this.binOutput, 'pixel-out')
    }
  }
};
</script>
<style>
form {
 display: flex;
  flex-wrap: wrap;
}

fieldset {
  margin: 10px;
  padding: 10px;
  flex-grow: 1;
  width: 200px;
  border: 1px solid #666;
  border-radius: 1px;
  color: tomato;
}

label {
  color: whitesmoke;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}

label input[type=text] {
  width: 100%;
}

input[type=number] {
  width: 40%;
}

input {
  background-color: #555;
  font-size: 0.8em;
  color: tomato;
  border: none;
  margin: 5px 0 10px 0;
}

input:disabled {
  background: none;
  border: 1px dotted whitesmoke;
  color: #fff;
}

input[type="radio"], range, button {
  cursor: pointer;
}

input[type="text"], input[type="number"] {
  padding: 10px;
}

input[type="range"] {
  width: 100%;
}

button {
  line-height: 1.5;
  border: none;
  padding: 10px 20px;
  background-color: dodgerblue;
  color: #fff;
  font-size: 1em;
  min-width: 120px;
  max-width: 100%;
}

button.primary, button.active {
  background-color: tomato;
  color: whitesmoke;
}

textarea {
  width: 100%;
  height: 50vh;
  margin: 10px;
  padding: 10px;
  border-radius: 2px;
  font-family: monospace;
  background: none;
  color: #ccc;
}

summary {
  color: dodgerblue;
  font-weight: bold;
  cursor: pointer;
}

  .highlighted {
    color: tomato;
    margin-bottom: 5px;
  }

  .help-link {
    text-decoration: none;
    background: dodgerblue;
    padding: 2px;
    display: inline-block;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 10px;
    text-align: center;
    margin-left: 10px;
  }
</style>
