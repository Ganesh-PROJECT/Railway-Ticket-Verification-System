let model, webcamStream;

// Load the Teachable Machine model
async function loadModel() {
    model = await tf.loadLayersModel('model/model.json');
    console.log("Teachable Machine model loaded!");
}

document.getElementById('verify-aadhaar').addEventListener('click', () => {
    const aadhaar = document.getElementById('aadhaar').value.trim();

    // Check Aadhaar format
    const isValidFormat = /^[2-9]{1}[0-9]{11}$/.test(aadhaar);
    if (!isValidFormat) {
        document.getElementById('aadhaar-result').innerText = "Invalid Dummy Aadhaar format!";
        return;
    }

    // Verify Aadhaar from the mock database
    fetch('dummy_database.json')
        .then(response => response.json())
        .then(data => {
            const isVerified = data.dummyAadhaars.includes(aadhaar);
            document.getElementById('aadhaar-result').innerText = isVerified
                ? "Dummy Aadhaar verified successfully!"
                : "Dummy Aadhaar verification failed!";
        })
        .catch(err => {
            console.error("Error fetching database:", err);
            document.getElementById('aadhaar-result').innerText = "Error verifying Dummy Aadhaar.";
        });
});

document.getElementById('start-camera').addEventListener('click', async () => {
    const webcamElement = document.getElementById('webcam');
    try {
        webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamElement.srcObject = webcamStream;
    } catch (err) {
        console.error("Error accessing webcam:", err);
        document.getElementById('face-result').innerText = "Could not access the webcam.";
    }
});

document.getElementById('verify-face').addEventListener('click', async () => {
    if (!model) {
        document.getElementById('face-result').innerText = "Model not loaded. Please wait.";
        return;
    }

    const video = document.getElementById('webcam');
    const imageTensor = tf.browser.fromPixels(video).resizeBilinear([224, 224]).expandDims(0);
    const prediction = await model.predict(imageTensor).data();

    const verified = prediction[0] > prediction[1]; // Assume first class is "Verified"
    document.getElementById('face-result').innerText = verified
        ? "Face verified successfully!"
        : "Face verification failed!";
});

loadModel();
