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
      <legend>Info:</legend>
        <p>❌brotli compressed output not implemented yet.</p>
    </fieldset>
    <fieldset v-if="isLocal">
      <legend>Output settings</legend>
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
    </fieldset>
    <fieldset>
      <legend>Protocol to use</legend>
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
      <p v-if="!binOutput">current packets per Frame: {{ packetCountPerFrame }} </p>
    </fieldset>
    <fieldset class="slider-wrapper">
      <legend>Output length</legend>
      <p>Number pixels to generate</p>
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
      <legend>LED settings</legend>
      <p>3 or 4 brightness values per LED?</p>
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
      <label for="dimmer">
        <input
                type="range"
                id="dimmer"
                min="1"
                max="100"
                v-model="options.leds.masterBrightness"
                @change="saveOptionsToServer"
        />
      </label>
    </fieldset>
    <fieldset>
      <legend>Textual preview</legend>
      <p>Wanna see output as integers or as hex?</p>
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
                  type="text"
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
                  type="text"
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
        udpTargetPort: "1234"
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
      const {leds, serverOptions, timer, stats} = data
      window.testhelpers.saveState('input-form', {leds, serverOptions, timer, stats})
    })
  },
  methods: {
    saveOptionsToServer() {
      this.output()
      this.setOptions()
    },
    output() {
      const payload = this.getRandomPixelData(this.leds.pixelAmount, this.leds.ledType)
      //const payload = rawPayload.map(colorChannel => parseInt(colorChannel * (this.masterBrightness/100))
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
        body: JSON.stringify({serverOptions: this.serverOptions, leds: this.leds})
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

label input {
  width: 50%;
  min-width: 200px;
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
  background-color: gray;
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
  color: #000;
  font-family: monospace;
}
</style>
