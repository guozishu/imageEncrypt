const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scanvas = document.getElementById('smallcanvas');
const sctx = scanvas.getContext('2d');
const width = 640
const height = 480

scanvas.width = 320
scanvas.height = 240

canvas.width = width
canvas.height = height

const constraints = {
    audio: false,
    video: { width: { exact: 640 }, height: { exact: 480 } }
};

function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}

function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);


const randomStr = (() => {
    const map = new Map();
    return (key = 'key') => {
        if (map.has(key)) {
            return map.get(key)
        }
        const value = Math.random().toString(36).slice(2, 5)
        map.set(key, value)
        return value
    }
})()

const binaryStr = (str) =>
    str.split('').reduce((c, i) => {
        const byte = i.charCodeAt(0).toString(2)
        return c + '00000000'.slice(byte.length) + byte
    }, '')

// encrypt
const mergeData = (originalData, binaryStr, color = 'R') => {
    let oData = originalData.data
    const colorPos = {
        "R": 0,
        "G": 1,
        "B": 2
    }
    let i = 0
    const binaryLength = binaryStr.length
    while (i < binaryLength) {
        const pos = 4 * i + colorPos[color]
        let byte = parseInt(oData[pos], 10).toString(2)
        byte = ('0000000'.slice(byte.length) + byte).slice(0, 7) + binaryStr[i]
        oData[pos] = parseInt(byte, 2)
        ++i
    }
    return originalData
}

//decrypt
function processData(originalData, binaryStrLength, color = 'R') {
    const colorPos = {
        "R": 0,
        "G": 1,
        "B": 2
    }
    let oData = originalData.data;
    let text = '', byte = ''
    const binaryLength = binaryStrLength
    for (let i = 0; i < binaryLength; i++) {
        const pos = 4 * i + colorPos[color]
        let bintry = parseInt(oData[pos]).toString(2);
        byte += bintry[bintry.length - 1]
        if (byte.length % 8 === 0) {
            text += String.fromCodePoint(parseInt(byte.slice(byte.length - 8, byte.length), 2))
        }
    }
    return text
}

document.getElementById("snap").onclick = function () {
    // ctx.drawImage(video, 0, 0, width, height);
    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext("2d")
    tempCanvas.width = width
    tempCanvas.height = height
    // tempCtx.drawImage(video, 0, 0, width, height)

    tempCtx.drawImage(video, 0, 0, width, height, 0, 0, width, height)
    const imageData = tempCtx.getImageData(0, 0, width, height)
    const binaryText = binaryStr(randomStr("img"));
    console.log(randomStr("img"))
    const newOriginData = mergeData(imageData, binaryText, 'G')

    ctx.putImageData(newOriginData, 0, 0)
    
    sctx.drawImage(video, 0, 0, width, height, 0, 0, width / 2, height / 2)
}

document.getElementById("decrypt").onclick = function () {
    const decryptText = processData(ctx.getImageData(0, 0, width, height), 24, 'G');
    console.log('decryptText:', decryptText)
}

