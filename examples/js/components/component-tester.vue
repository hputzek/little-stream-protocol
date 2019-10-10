<template>
  <form>
      <div style="display: flex;" v-if="isLocal">
          <div style="font-size: 80px;">🤷‍♀️</div>
          <div>
              <h2>You can test without udp output only</h2>
              <p>You must use this tool on your local machine to send udp data with it.</p>
              <p>Please refer to the <a href="https://github.com/hputzek/little-stream-protocol">GitHub Repo</a> to get info on how to set this up.</p>
          </div>
      </div>
    <p>Output settings:</p>
      <p>❌brotli compressed output not implemented yet.</p>
    <div v-if="isLocal">
      <label for="udp-target-ip"
        >Target IP
        <input
          type="text"
          id="udp-target-ip"
          v-model="serverOptions.udpTargetIp"
          @change="setOptions"
        />
      </label>
      <label for="udp-target-port">
        Target Port
        <input
          type="text"
          id="udp-target-port"
          v-model="serverOptions.udpTargetPort"
          @change="setOptions"
        />
      </label>
    </div>
    <p>Protocol to use</p>
    <p>
      <label for="protocol-pixels"
        >Pixels
        <input
          type="radio"
          id="protocol-pixels"
          name="protocol"
          value="pixels"
          v-model="protocol"
          @change="output"
        />
      </label>
      <label for="protocol-pixels+s"
        >Pixels+s
        <input
          type="radio"
          id="protocol-pixels+s"
          name="protocol"
          value="pixels+s"
          v-model="protocol"
          @change="output"
        />
      </label>
    </p>
    <p>Number of random pixels to generate</p>
    <p class="slider-wrapper">
      <input
        type="range"
        id="pixel-amount-range"
        min="1"
        max="2000"
        v-model="pixelAmount"
        @change="output"
      />
      <input
        type="text"
        class="pixel-amount"
        id="pixel-amount"
        v-model="pixelAmount"
        @change="output"
      />
    </p>
    <p>LED Type? (3 or 4 brightness values per LED)</p>
    <p>
      <label for="type-rgb"
        >RGB
        <input
          type="radio"
          id="type-rgb"
          name="led-type"
          value="rgb"
          v-model="ledType"
          @change="output"
      /></label>
      <input
        type="radio"
        id="type-rgbw"
        name="led-type"
        value="rgbw"
        v-model="ledType"
        @change="output"
      />
      <label for="type-rgbw">RGBW</label>
    </p>
    <p>Wanna see output as integers or as hex?</p>
    <p>
      <label for="output-hex"
        >HEX<input
          type="radio"
          id="output-hex"
          name="output-type"
          value="hex"
          v-model="outputType"
          @change="output"
      /></label>
      <label for="output-int"
        >INT<input
          type="radio"
          id="output-int"
          name="output-type"
          value="int"
          v-model="outputType"
          @change="output"
      /></label>
    </p>
      <p>Auto send</p>
      <p class="slider-wrapper">
          <input
                  type="range"
                  id="timer"
                  min="20"
                  max="2000"
                  v-model="timer.duration"
                  @change="startTimer"
          />
          <input
                  type="text"
                  class="pixel-amount"
                  id="duration-text"
                  v-model="timer.duration"
                  @change="output"
          />
          <button type="button" @click="toggleTimer">Start/Stop</button>
      </p>
    <textarea v-model="guiOutput"></textarea>
  </form>
</template>
<script>
module.exports = {
  data() {
    return {
      webSocketConn: new WebSocket("ws://localhost:8080"),
      pixelAmount: 10,
      ledType: "rgb",
      outputType: "hex",
      protocol: "pixels",
      guiOutput: "",
      timer: {
        duration: 1000,
        intervalId: null
      },
      serverOptions: {
        //The ip & port for sending incoming websocket packets via udp
        udpTargetIp: "localhost",
        udpTargetPort: "1234"
      }
    };
  },
  computed: {
    isLocal: function() {
      return (
        location.hostname === "localhost" || location.hostname === "127.0.0.1"
      );
    }
  },
  mounted() {
    this.setOptions({});
    this.output()
    this.webSocketConn.onmessage = function(evt) {
      console.log("received from server: " + evt.data);
    };
  },
  methods: {
    output() {
      const pixelsData = window.pixels.getFrame({
        payload: this.getRandomPixelData(this.pixelAmount, this.ledType)
      });
      const sData = window.s.getFrame({
        payload: pixelsData
      });
      const frames = this.protocol === "pixels" ? [pixelsData] : sData;
      const guiOutput = frames.reduce((acc, frame) => {
        const frameContent = new Uint8Array(frame);
        return [...acc, ...frameContent];
      }, []);
      if (this.webSocketConn.readyState === 1) {
        frames.map(frame => {
          this.webSocketConn.send(frame);
        });
      }
      this.guiOutput =
        this.outputType === "hex" ? this.toHexString(guiOutput) : guiOutput;
    },
    toggleTimer() {
      if (this.timer.intervalId === null) {
        this.startTimer();
      } else {
        clearInterval(this.timer.intervalId);
        this.timer.intervalId = null
      }
    },
    startTimer() {
      clearInterval(this.timer.intervalId);
      // Store the id of the interval so we can clear it later
      this.timer.intervalId = setInterval(() => {
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
      fetch("http://localhost:3002", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(this.serverOptions)
      })
        .then(function(response) {
          return response.json();
        })
        .then(data => {
          if (data.result !== true) {
            alert("Error saving new options to udp relay.");
          }
        });
    }
  }
};
</script>
<style scoped>
form {
  color: #fff;
  max-width: 640px;
  margin: 0 auto;
  padding: 20px;
}

input {
  color: #000;
}

.slider-wrapper {
  display: flex;
}

.slider-wrapper > * {
  flex-grow: 1;
  margin-right: 20px;
}

.pixel-amount {
  width: 6em;
  flex-grow: 0;
}

textarea {
  width: 100%;
  height: 50vh;
  color: #000;
  font-family: monospace;
}
</style>
