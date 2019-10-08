import {getFrameData} from "../index.js";

// get frame data for a given payload
const frames = getFrameData({payload: new ArrayBuffer(5000)})

console.log(frames)
