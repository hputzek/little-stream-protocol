<template>
    <div class="bg">
        <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" :style="`height:${canvasHeight * 5}px;`"></canvas>
    </div>
</template>

<script>
    module.exports = {
        props: ['frame', 'leds'],
        mounted() {
          this.ctx = this.$refs.canvas.getContext('2d')
            this.ctx.imageSmoothingEnabled = false
            console.log(this.ctx)
            this.image = this.ctx.createImageData(1,1)
        },
        data() {
            return {
                frameCount: 0,
                ctx: null,
                image: null,
                canvasWidth: 144,
                y: 0,
            }
        },
        computed: {
            canvasHeight() {
                return Math.ceil(this.leds.pixelAmount / this.canvasWidth)
            },
          channelCount() {
              return this.leds.outputType === 'rgb' ? 3 : 4
          }
        },
        watch: {
            frame(frame) {
                this.draw(frame)
            }
        },
        methods: {
            draw(frame) {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasWidth);
                const pixels = this.frame.reduce((acc, colorChannel, index, frame) => {
                    if(((index) / this.channelCount) % this.canvasWidth === 0) {
                        this.y ++
                    }
                    if(index % this.channelCount === 0) {
                        const colorModel = this.channelCount === 3 ? [0,0,0] : [0,0,0,0]
                        const color = colorModel.reduce((acc, channel, channelIndex) => [...acc, frame[channelIndex + index]] , [])
                        const currentPixelNumber = index / this.channelCount
                        this.image.data[0] = color[0]
                        this.image.data[1] = color[1]
                        this.image.data[2] = color[2]
                        this.image.data[3] = 255

                        this.ctx.putImageData(this.image, currentPixelNumber - (this.canvasWidth * this.y) , this.y * 2 )
                        return [...acc, color]
                    }
                    return acc
                }, [])
                this.y = 0
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
    }
</style>
