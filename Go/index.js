

    var aVideo = document.getElementById('video');
    var aCanvas = document.getElementById('canvas');
    var ctx = aCanvas.getContext('2d');

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
    navigator.getUserMedia({ video: true }, gotStream, noStream);
    function gotStream(stream) {
        video.srcObject = stream;
        video.onerror = function () {
            stream.stop();
        };
        stream.onended = noStream;
        video.onloadedmetadata = function () {
            console.log('摄像头成功打开！');
        };
    }
    function noStream(err) {
        alert(err);
    }

    const gooe = new Go();
    WebAssembly.instantiateStreaming(fetch("lib.wasm"), gooe.importObject)
        .then((result) => {
            gooe.run(result.instance);
        });
