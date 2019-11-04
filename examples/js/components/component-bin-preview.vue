<template>
        <ul class="bin-preview">
            <li v-for="(frame, index) in guiOutput">
                <p>{{frame}}</p>
                <button type="button" @click="saveFrame(index)">
                    💾
                </button>
            </li>
        </ul>
</template>

<script>
    module.exports = {
        props: ['gui-output'],
        methods: {
            saveFrame(index) {
                window.testhelpers.createAndDownloadBlobFile(this.guiOutput[index], "pixel-out");
            }
        }
    }
</script>

<style scoped>
    .bin-preview {
        width: 100%;
        height: 50vh;
        margin: 10px;
        padding: 10px;
        border-radius: 2px;
        font-family: monospace;
        background: none;
        color: #ccc;
    }

    li {
        display: flex;
        background-color: rgba(0,0,0,0.2);
        margin: 10px 0;
        padding: 10px 10px;
        max-height: 120px;
        overflow-y: scroll;
    }
</style>
