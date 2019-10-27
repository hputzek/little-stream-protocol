<template>
  <div>
    <form class="matrix-settings" ref="matrix-settings">
      <label for="matrix-width">
        Matrix width
        <input
          type="number"
          min="1"
          id="matrix-width"
          v-model="settings.matrixWidth"
        />
      </label>
      <label for="matrix-height">
        Matrix height
        <input
          type="number"
          min="1"
          id="matrix-height"
          v-model="settings.matrixHeight"
        />
      </label>
      <details>
        <summary>
          Matrix row layout
        </summary>
        <label for="matrix-type-normal"
          >--><br />--><br />-->
          <input
            type="radio"
            id="matrix-type-normal"
            name="led-type"
            value="normal"
            v-model="settings.matrixType"
        /></label>
        <hr />
        <label for="type-rgbw"
          >--><br /><--<br />-->
          <input
            type="radio"
            id="type-rgbw"
            name="led-type"
            value="snake"
            v-model="settings.matrixType"
          />
        </label>
      </details>
    </form>
    <video ref="video-element" :src="videoSource" controls loop muted></video>
    <canvas
      ref="canvas"
      :width="settings.matrixWidth"
      :height="settings.matrixHeight"
    ></canvas>
  </div>
</template>

<script>
module.exports = {
  props: ["leds", "protocol"],
  created() {
    this.$emit("handler", this.createFrame);
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
    this.videoElement = this.$refs["video-element"];
    // emit event when video starts playling
    this.videoElement.addEventListener(
      "play",
      () => {
        this.$emit("play", true);
      },
      false
    );
    this.videoElement.addEventListener(
      "pause",
      () => {
        this.$emit("stop", true);
      },
      false
    );

    // load state from localstorage
    const settingsFromLocalstorage = window.testhelpers.loadState(
      "matrix-settings"
    );
    this.settings = settingsFromLocalstorage
      ? settingsFromLocalstorage
      : this.settings;
    // set handler to save settings on change
    this.$refs["matrix-settings"].addEventListener("change", () => {
      window.testhelpers.saveState("matrix-settings", this.settings);
    });
  },
  computed: {
    bytesPerPixel() {
      return this.protocol.pixels.type === "rgbw" ? 4 : 3;
    }
  },
  data() {
    return {
      ctx: null,
      videoElement: null,
      videoSource: "/assets/video/01.mp4",
      settings: {
        matrixWidth: 20,
        matrixHeight: 20
      }
    };
  },
  methods: {
    createFrame() {
      this.$emit("frame", this.getPixelData(this.leds.pixelAmount));
    },
    getPixelData(pixelAmount) {
      if (this.videoElement.paused || this.videoElement.ended) return output;
      // draw from video frame to canvaas
      this.ctx.drawImage(
        this.videoElement,
        0,
        0,
        this.settings.matrixWidth,
        this.settings.matrixHeight
      );
      // Read image from canvas
      const frame = this.ctx.getImageData(
        0,
        0,
        this.settings.matrixWidth,
        this.settings.matrixHeight
      );
      // Byte progression in frame.data is R,G,B,A (We discard the 4th value)
      const output = frame.data.reduce((acc, current, index, arr) => {
        if (index % 4 === 0) {
          const color = [arr[index], arr[index + 1], arr[index + 2]];
          if (this.bytesPerPixel === 4) {
            color.push(0);
          }
          acc = [...acc, color];
        }
        return acc;
      }, []);

      if (this.settings.matrixType === "normal") {
        return output.flat().slice(0, pixelAmount);
      } else {
        let rowCount = 0;
        return output
          .reduce((acc, current, index, arr) => {
              // add chunks of full array to accumulator
            if (this.settings.matrixWidth % index === 0) {
              const row = arr.slice(index, index + this.settings.matrixWidth);

              if (rowCount % 2 === 0) {
                acc = [...acc, row.reverse()];
              } else {
                acc = [...acc, row];
              }
              rowCount++;
            }
            return acc;
          }, [])
          .flat(2)
          .slice(0, pixelAmount);
      }
    }
  }
};
</script>

<style scoped>
video {
  width: 100%;
}
canvas {
  background: black;
  image-rendering: pixelated;
  margin: 10px 0;
}
hr {
  width: 100%;
}
details {
  width: 100%;
  margin-bottom: 10px;
}
</style>
