<template>
    <div>
        <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
            {{frameCount}}
    </div>
</template>

<script>
    module.exports = {
        props: ['frame'],
        mounted() {
          this.ctx = this.$refs.canvas.getContext('2d')
            console.log(this.ctx)
            this.image = this.ctx.createImageData(1,1)
        },
        data() {
            return {
                frameCount: 0,
                ctx: null,
                image: null,
                canvasWidth: 50,
                canvasHeight: 50,
                y: 1
            }
        },
        watch: {
            frame(frame) {
                this.draw(frame)
            }
        },
        methods: {
            draw(frame) {
                this.frameCount++
                this.image.data[0] = 255
                this.image.data[1] = 255
                this.image.data[2] = 255
                this.image.data[3] = 255
                this.ctx.putImageData(this.image, 1 + this.frameCount,this.y )
            }
        }
    }
</script>

<style scoped>
    canvas {
        width: 100%;
        height: auto;
    }
</style>
