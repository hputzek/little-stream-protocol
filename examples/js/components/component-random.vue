<template>
<div>
    <p>Current mode: Random pixel data</p>
    <p>Frames sent: {{this.framesSent}}<button style="margin-left: 10px" class="small" type="button" @click="framesSent = 0">Reset</button></p>
</div>
</template>

<script>
    module.exports = {
        props: ['leds'],
        created() {
            this.$emit('handler', this.createFrame);
        },
        data() {
            return {
                framesSent: 0
            }
        },
        methods: {
            createFrame() {
                this.framesSent+=1
                this.$emit('frame', this.getRandomPixelData(this.leds.pixelAmount, this.leds.ledType))
            },
            getRandomPixelData(pixelAmount, ledType) {
                const bytesPerPixel = ledType === "rgbw" ? 4 : 3;
                return Array.from({ length: pixelAmount * bytesPerPixel }, () =>
                    Math.floor(Math.random() * 255)
                );
            },
        },
    }
</script>
