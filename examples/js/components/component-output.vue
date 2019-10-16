<template>
    <div class="bg">
        <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" :style="`height:${canvasHeight * 10}px;`"></canvas>
    </div>
</template>

<script>
    module.exports = {
        props: ['frame', 'leds', 'protocol'],
        mounted() {
          this.ctx = this.$refs.canvas.getContext('2d')
        },
        data() {
            return {
                frameCount: 0,
                ctx: null,
                canvasWidth: 144
            }
        },
        computed: {
            canvasHeight() {
                return Math.ceil(this.leds.pixelAmount / this.canvasWidth)
            },
          channelCount() {
              return this.protocol.pixels.type === 'rgb' ? 3 : 4
          }
        },
        watch: {
            frame(frame) {
                this.draw(frame)
            }
        },
        methods: {
            draw(frame) {
                const image = this.ctx.createImageData(this.canvasWidth, this.canvasHeight)
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasWidth);
                let currentPixel = 0
                const pixels = this.frame.reduce((acc, colorChannel, index, frame) => {
                    if(index % this.channelCount === 0) {
                        const colorModel = this.channelCount === 3 ? [0,0,0] : [0,0,0,0]
                        const color = colorModel.reduce((acc, channel, channelIndex) => [...acc, frame[channelIndex + index]] , [])
                        image.data[currentPixel + 0] = color[0]
                        image.data[currentPixel + 1] = color[1]
                        image.data[currentPixel + 2] = color[2]
                        image.data[currentPixel + 3] = 255
                        currentPixel+=4
                        return [...acc, color]
                    }
                    return acc
                }, [])
                window.requestAnimationFrame(() => {
                    this.ctx.putImageData(image, 0,0)
                })
                this.frameCount++
            }
        }
    }
</script>

<style scoped>
    .bg {
        background: black;
        padding: 10px 30px;
        margin: 10px;
        border-radius: 5px;
    }
    canvas {
        width: 100%;
        height: 50px;
        background: black;
        image-rendering: pixelated;
    }
</style>
