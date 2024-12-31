let model, webcam;

async function loadModel() {
    model = await tf.loadLayersModel('model/model.json');
    console.log("Model loaded!");
}

document.getElementById('start-camera').addEventListener('click', async () => {
    const webcamElement = document.getElementById('webcam');
    webcam = await navigator.mediaDevices.getUserMedia({ video: true });
    webcamElement.srcObject = webcam;
});

document.getElementById('verify').addEventListener('click', async () => {
    const video = document.getElementById('webcam');
    const capture = tf.browser.fromPixels(video);
    const prediction = await model.predict(capture.expandDims(0));
    const result = prediction.argMax(-1).dataSync()[0];

    const resultText = result === 0 ? "Face Verified" : "Verification Failed";
    document.getElementById('result').innerText = resultText;
});

loadModel();
