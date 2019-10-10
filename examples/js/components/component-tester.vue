<template>
    <form>
        <p>Output settings:</p>
        <div v-if="isLocal">
            <label for="udp-target-ip">Target IP
                <input type="text" id="udp-target-ip" v-model="options.udpTargetIp"/>
            </label>
            <label for="udp-target-port"> Target Port
                <input type="text" id="udp-target-port" v-model="options.udpTargetPort"/>
            </label>
        </div>
        <p>Number of random pixels to generate</p>
        <p class="range-wrapper">
            <input type="range" id="pixel-amount-range" min="0" max="2000" v-model="pixelAmount"/>
            <input type="text" class="pixel-amount" id="pixel-amount" v-model="pixelAmount"/>
        </p>
        <p>LED Type? (3 or 4 brightness values per LED)</p>
        <p>
            <label for="type-rgb">RGB <input type="radio" id="type-rgb"
                                             name="led-type" value="rgb" v-model="ledType"></label>

            <input type="radio" id="type-rgbw"
                   name="led-type" value="rgbw" v-model="ledType">
            <label for="type-rgbw">RGBW</label>
        </p>
        <p>Wanna see output as integers or as hex?</p>
        <p>

            <label for="output-hex">HEX<input type="radio" id="output-hex"
                                              name="output-type" value="hex" v-model="outputType"></label>


            <label for="output-int">INT<input type="radio" id="output-int"
                                              name="output-type" value="int" v-model="outputType"></label>
        </p>
        <textarea v-model="output"></textarea>
    </form>
</template>

<script>
    module.exports = {
        data() {
            return {
                pixelAmount: 10,
                ledType: 'rgb',
                outputType: 'hex',
                options: {
                    //The ip & port for sending incoming websocket packets via udp
                    udpTargetIp:'',
                    udpTargetPort: ''
                }
            }
        },
        computed: {
          output: function() {
              const frames = window.s.getFrame({
                  payload: window.pixels.getFrame({ payload: this.getRandomPixelData(this.pixelAmount, this.ledType) })
              })
              const output = frames.reduce((acc, frame) => {
                  const frameContent = new Uint8Array(frame)
                  return [...acc, ...frameContent]
              }, [])
              return this.outputType === 'hex' ? this.toHexString(output) : output
          },
            isLocal: function () {
                return location.hostname === "localhost" || location.hostname === "127.0.0.1"
            }
        },
        mounted() {
          this.setOptions({})
        },
        watch: {
            options: {
                handler: function (newOptions) {this.setOptions(newOptions)},
                deep: true
            },
        },
        methods: {
            // generate a test payload
            getRandomPixelData(pixelAmount, ledType) {
                const bytesPerPixel = ledType === 'rgbw' ? 4 : 3
                return Array.from({ length: pixelAmount * bytesPerPixel }, () =>
                    Math.floor(Math.random() * 255)
                )
            },
            toHexString(bytes) {
                return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0') + ' ', '');
            },
            setOptions(options) {
                fetch('http://localhost:3002', {
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    method: 'POST',
                    body: JSON.stringify(options)
                }).then(function(response) {
                    return response.json()
                }).then(function(data) {
                    if(data.result !== true) {
                        alert("Error setting new options.")
                    }
                    else {
                        this.options = Object.assign({},data.options)
                    }
                });
            },
        }
    }
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
    .range-wrapper {
        display: flex;
    }

    .range-wrapper > * {
        flex-grow:  1;
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
