import { getFrameData } from "../index.js";

// generate a test payload
const testData = Array.from({ length: 150000 }, () =>
  Math.floor(Math.random() * 255)
);
const testPayload = new Uint8Array(testData).buffer;


// get frame data for a given payload
const frames = getFrameData({ payload: testPayload });

console.log(frames);
