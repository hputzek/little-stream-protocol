<template>
  <form ref="input-form">
    <div style="display: flex; width: 100%;" v-if="!isLocal">
      <div style="font-size: 80px;">🤷‍♀️</div>
      <div>
        <h2>You can test without udp output only</h2>
        <p>
          You must use this tool on your local machine to send udp data with it.
        </p>
        <p>
          Please refer to the
          <a href="https://github.com/hputzek/little-stream-protocol"
            >GitHub Repo</a
          >
          to get info on how to set this up.
        </p>
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
        <summary
          >pixels settings
          <a
            class="help-link"
            href="https://github.com/IoTPanic/pixels"
            title="pixels github page"
            >❔</a
          ></summary
        >
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
        <summary
          >s settings<a
            class="help-link"
            href="https://iotpanic.github.io"
            title="s github page"
            >❔</a
          ></summary
        >
        <label
          for="protocol-pixels+s-package-size"
          title="if packet to send is bigger it will be split in fragments"
        >
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
        <label
          for="protocol-pixels+s-package-size"
          title="if packet to send is bigger it will be split in fragments"
        >
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
          <input
            @change="saveOptionsToServer"
            v-model="protocol.s.header.downstreamFlag"
            type="checkbox"
            id="protocol-pixels+s-downstream"
          />
        </label>
        <label
          for="protocol-pixels+s-type"
          title="if packet to send is bigger it will be split in fragments"
        >
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
        <input
          @change="saveOptionsToServer"
          v-model="protocol.s.header.compressedFlag"
          type="checkbox"
          id="compression-checkbox"
        />
      </label>
      <details>
        <summary
          >Brotli settings
          <a
            class="help-link"
            title="brotli.js github page"
            href="https://github.com/foliojs/brotli.js?files=1"
            target="_blank"
            >❔</a
          ></summary
        >

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
          v-model="protocol.pixels.type"
          @change="saveOptionsToServer"
      /></label>
      <label for="type-rgbw"
        >RGBW
        <input
          type="radio"
          id="type-rgbw"
          name="led-type"
          value="rgbw"
          v-model="protocol.pixels.type"
          @change="saveOptionsToServer"
        />
      </label>
      <label for="dimmer" class="highlighted">
        Master brightness
        <div style="display:flex; width: 100%">
        <input
          type="range"
          id="dimmer"
          min="1"
          max="100"
          v-model="leds.masterBrightness"
        />
          <input
                  min="0"
                  max="100"
                  type="number"
                  id="brightness-input"
                  v-model="leds.masterBrightness"
                  @change="saveOptionsToServer"
          />
        </div>
      </label>
      <label class="highlighted">Number of leds</label>
      <div style="display:flex;">
        <input
                type="range"
                id="pixel-amount-range"
                min="1"
                max="2000"
                v-model="leds.pixelAmount"
                @input="saveOptionsToServer"
        />

        <input
                min="1"
                max="2000"
                type="number"
                class="pixel-amount"
                id="pixel-amount"
                v-model="leds.pixelAmount"
                @input="saveOptionsToServer"
        />
      </div>

    </fieldset>
    <fieldset>
      <legend>Stats</legend>
      <p v-if="!webSocketConnected">⚠️ Lost connection to backend :-(</p>
      <ul class="error-messages-list" v-for="message in stats.errorMessages">
        <li>⚠️ {{message}}</li>
      </ul>
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
      <ul class="stats">
        <li v-if="leds.protocol==='pixels+s'">
          <span>
            Packet count
          </span>
          <span>
            {{ stats.packetSizes.length }}
          </span>
        </li>
        <li v-if="leds.protocol==='pixels+s'">
          <span>
            Packet sizes
          </span>
          <span>
            {{ stats.packetSizes.length ? stats.packetSizes.join(' / '): '-' }}
          </span>
        </li>
        <li>
          <span>
            Payload <span v-if="protocol.s.header.compressedFlag">before compression</span>
          </span>
          <span>
            {{ stats.payloadBeforeCompression }}
          </span>
        </li>
        <li v-if="protocol.s.header.compressedFlag">
          <span>
            Payload after compression
          </span>
          <span>
            {{ stats.payloadAfterCompression }}
          </span>
        </li>
        <li>
          <span>
            Frame size
          </span>
          <span>
            {{ stats.frameSize }}
          </span>
        </li>
      </ul>
    </fieldset>
    <fieldset class="slider-wrapper">
      <legend>Auto send</legend>

      <input
        type="range"
        id="autoSendTimer-duration"
        min="1"
        max="500"
        v-model="autoSendTimer.duration"
        @input="startTimer"
      />

      <label for="duration-interval">
        Interval (ms)
        <input
                min="1"
                max="500"
          type="number"
          class="pixel-amount"
          id="duration-interval"
          v-model="autoSendTimer.duration"
          @change="saveOptionsToServer"
        />
      </label>
      <label for="duration-fps">
        FPS
        <input
          type="number"
          class="pixel-amount"
          id="duration-fps"
          v-model="currentFps"
          @change="saveOptionsToServer"
        />
      </label>
        <select v-model="leds.activeTestingModeComponent">
            <option v-for="testingMode in testingModes" :value="testingMode.component">{{testingMode.label}}</option>
        </select>
        <component :is="leds.activeTestingModeComponent" :leds="leds" :protocol="protocol" @handler="setGetFrameHandler" @frame="output" @play="startTimer" @stop="stopTimer"></component>

      <button
        type="button"
        :class="this.autoSendTimerIntervalId ? 'active' : ''"
        @click="toggleTimer"
      >
        {{ autoSendTimerButtonText }}
      </button>
      <button type="button" v-if="binOutput" @click="saveFrame">
        💾 Frame
      </button>
    </fieldset>
    <component-output style="width: 100%;" :protocol="protocol" :leds="leds" :frame="currentFrame"></component-output>
    <textarea v-model="guiOutput"></textarea>
  </form>
</template>
<script>
module.exports = {
  data() {
    return {
      webSocketConn: new WebSocket("ws://localhost:8080"),
      webSocketConnected: false,
      packetCountPerFrame: 0,
      autoSendTimerIntervalId: null,
      statsFetchTimerIntervalId: null,
      currentFrame: [],
      binOutput: null,
      guiOutput: null,
        testingModes:[
            {
            component: 'component-random',
            label: 'Random values'
            },
            {
                component: 'component-snake',
                label: 'Snake'
            },
          {
            component: 'component-video',
            label: 'Video matrix'
          }
        ],
      leds: {
          activeTestingModeComponent: 'component-random',
        pixelAmount: 10,
        outputType: "hex",
        protocol: "pixels",
        masterBrightness: 15
      },
      autoSendTimer: {
        duration: 1000
      },
      serverOptions: {
        //The ip & port for sending incoming websocket packets via udp
        udpTargetIp: "localhost",
        udpTargetPort: "1234"
      },
      protocol: {
        s: {
          maxPacketSize: 1470,
          header: {
            version: 0,
            downstreamFlag: true,
            compressedFlag: false,
            type: 1
          },
          message: {
            nodeId: 1,
            session: 1
          }
        },
        pixels: {
          type: "rgb",
          syncWord: 0,
          channelNumber: 0
        }
      },
      compression: {
        mode: 0,
        quality: 11,
        lgwin: 22
      },
      stats: {
        packetSizes: [],
        payloadBeforeCompression: 0,
        payloadAfterCompression: 0,
        frameSize: 0,
        errorMessages: []
      }
    };
  },
  computed: {
    currentFps: {
      // getter
      get: function () {
        return Math.round(1000 / this.autoSendTimer.duration)
      },
      // setter
      set: function (newValue) {
          this.stopTimer()
        this.autoSendTimer.duration = Math.round(1000 / newValue)
          this.startTimer()
      }
    },
    isLocal() {
      return (
        location.hostname === "localhost" || location.hostname === "127.0.0.1"
      );
    },
    autoSendTimerButtonText() {
      return this.autoSendTimerIntervalId === null ? "Start" : "Stop";
    }
  },
  mounted() {
    // load state from localstorage
    const state = window.testhelpers.loadState("input-form");
    // set initial options
    this.setOptions();
    Object.keys(state).map(
            key => (this[key] = Object.assign(this[key], state[key]))
    );
    // set handler for receiving messages
    this.webSocketConn.onmessage = async evt => {
      const buffer = await evt.data.arrayBuffer();
      const binOutput = new Uint8Array(buffer);
      this.binOutput = binOutput;
      this.guiOutput =
        this.leds.outputType === "hex"
          ? this.toHexString(binOutput)
          : binOutput;
    };

    this.webSocketConn.onopen = () => {
      this.webSocketConnected = true
    };

    this.webSocketConn.onerror = () => {
      this.webSocketConnected = false
    };
    // set handler to save settings on change
    this.$refs["input-form"].addEventListener("change", () => {
      const data = Object.assign({}, this.$data);
      const { leds, serverOptions, autoSendTimer, compression, protocol } = data;
      window.testhelpers.saveState("input-form", {
        leds,
        serverOptions,
        autoSendTimer,
        compression,
        protocol
      });
    });
  },
  methods: {
    setGetFrameHandler(fn) {
      this.getFrame = fn
    },
    saveOptionsToServer() {
      this.getFrame();
      this.setOptions();
      this.fetchStats()
    },
    output(frameData) {
      if(!frameData || !frameData.length) {
        return
      }
      // set current Frame (used for preview output)
      this.currentFrame = frameData
      // add dimmer...
      const payload = frameData.map(channel => {
        return Math.ceil(channel * (this.leds.masterBrightness / 100));
      });

      if (this.webSocketConn.readyState === 1 && payload.length) {
        this.webSocketConnected = true
        this.webSocketConn.send(new Uint8Array(payload));
      }
    },
    toggleTimer() {
      if (this.autoSendTimerIntervalId === null) {
        this.saveOptionsToServer();
        this.getFrame()
        this.startTimer();
        this.startFetchStats()
      } else {
       this.stopTimer()
      }
    },
      stopTimer() {
          clearInterval(this.autoSendTimerIntervalId);
          this.autoSendTimerIntervalId = null;
          this.stopFetchStats()
      },
    startTimer() {
      clearInterval(this.autoSendTimerIntervalId);
      // Store the id of the interval so we can clear it later
      this.autoSendTimerIntervalId = setInterval(() => {
        this.getFrame()
      }, this.autoSendTimer.duration);
    },
    startFetchStats() {
      clearInterval(this.statsFetchTimerIntervalId);
      // Store the id of the interval so we can clear it later
      this.statsFetchTimerIntervalId = setInterval(() => {
        this.fetchStats();
      }, 500);
    },
    stopFetchStats() {
      clearInterval(this.statsFetchTimerIntervalId);
      this.statsFetchTimerIntervalId = null;
    },
    fetchStats() {
      fetch("http://localhost:3002?action=getStats", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify({})
      })
              .then(function(response) {
                return response.json();
              })
              .then(data => {
                if (data.result !== true) {
                  console.log('Error fetching stats...')
                } else {
                  this.stats = data.stats
                }
              }).catch((error) => {
                  this.webSocketConnected = false
              });
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
        body: JSON.stringify({
          serverOptions: this.serverOptions,
          leds: this.leds,
          compression: this.compression,
          protocol: this.protocol
        })
      })
        .then(function(response) {
          return response.json();
        })
        .then(data => {
          if (data.result !== true) {
            alert("Error saving new options to udp relay.");
          }
        }).catch((error) => {
        this.webSocketConnected = false
      });
    },
    saveFrame() {
      window.testhelpers.createAndDownloadBlobFile(this.binOutput, "pixel-out");
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
    max-width: 320px;
  border: 1px solid #666;
  border-radius: 1px;
  color: tomato;
}

label {
  cursor: pointer;
  color: whitesmoke;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}

label input[type="text"] {
  width: 100%;
}

input[type="number"] {
  width: 40%;
}

input, select {
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

input[type="radio"],
range,
button {
  cursor: pointer;
}

input[type="text"],
input[type="number"],
select {
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

button.small {
  line-height: 1;
  padding: 5px;
  font-size: 0.8em;
  min-width: initial;
}

button.primary,
button.active {
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

ul.stats {
  width: 100%;
  margin: 0;
  padding: 0;
}
ul.stats li {
  color: #fff;
  display: flex;
  align-content: space-between;
  padding: 5px 0;
}
ul.stats span {
  display: block;

}

  ul.stats span:nth-child(2) {
    flex-grow: 1;
    text-align: right;
    font-weight: bold;
    color: dodgerblue;
  }

  ul.error-messages-list {
    list-style-type: none;
    padding: 0;
    margin: 0 0 20px 0;
  }
</style>
