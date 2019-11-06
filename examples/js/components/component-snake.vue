<template>
  <div>
    <p>Current mode: Snake</p>
    <label for="colorpicker"
      >Color
      <input
        type="color"
        id="colorpicker"
        name="colorpicker"
        v-model="colorHex"
      />
    </label>
      <label for="snake-length-input" class="highlighted">Snake length</label>
      <div style="display:flex;">
          <input
                  type="range"
                  id="snake-length"
                  min="1"
                  :max="leds.pixelAmount"
                  v-model="snakeLength"
          />

          <input
                  min="1"
                  :max="leds.pixelAmount"
                  type="number"
                  id="snake-length-input"
                  v-model="snakeLength"
          />
      </div>
    <p>
      Frames sent: {{ this.framesSent
      }}<button
        style="margin-left: 10px"
        class="small"
        type="button"
        @click="framesSent = 0"
      >
        Reset
      </button>
    </p>
  </div>
</template>

<script>
module.exports = {
  props: ["leds", "protocol"],
  created() {
    this.$emit("handler", this.createFrame);
  },
  data() {
    return {
      framesSent: 0,
      positionCounter: 0,
      colorHex: "#3463ee",
        snakeLength: 1
    };
  },
  computed: {
    position() {
      return (
        Math.min(this.positionCounter, this.leds.pixelAmount) *
        this.bytesPerPixel
      );
    },
    bytesPerPixel() {
      return this.protocol.pixels.type === "rgbw" ? 4 : 3;
    },
    colorRgb() {
      return this.hexToRgb(this.colorHex);
    }
  },
  methods: {
    createFrame() {
      this.framesSent += 1;
      this.$emit("frame", this.getPixelData(this.leds.pixelAmount));
    },
    getPixelData(pixelAmount) {
      let output = Array.from(
        { length: pixelAmount * this.bytesPerPixel },
        () => 0
      );
      for(let snakepos = 0; snakepos < Math.min(this.leds.pixelAmount, this.snakeLength); snakepos += this.bytesPerPixel) {
          output[this.position + snakepos] = this.colorRgb.r;
          output[this.position + snakepos + 1] = this.colorRgb.g;
          output[this.position + snakepos + 2] = this.colorRgb.b;
          if (this.bytesPerPixel === 4) {
              output[this.position + 3] = 0;
          }
      }
      this.positionCounter += 1;
      if (this.positionCounter > pixelAmount -1) {
        this.positionCounter = 0;
      }
      return output;
    },
    componentToHex(c) {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    },

    rgbToHex(r, g, b) {
      return (
        "#" +
        this.componentToHex(r) +
        this.componentToHex(g) +
        this.componentToHex(b)
      );
    },
    hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null;
    }
  }
};
</script>
