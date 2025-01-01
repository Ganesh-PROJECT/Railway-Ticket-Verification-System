let model, webcamStream;

// Load the Teachable Machine model
async function loadModel() {
    model = await tf.loadLayersModel('model/model.json');
    console.log("Model loaded successfully!");
}

document.getElementById('verify-aadhaar').addEventListener('click', () => {
    const aadhaar = document.getElementById('aadhaar').value.trim();

    // Validate Aadhaar number format
    const isValidFormat = /^[2-9]{1}[0-9]{11}$/.test(aadhaar);
    if (!isValidFormat) {
        document.getElementById('aadhaar-result').innerText = "Invalid Aadhaar format!";
        return;
    }

    // Fetch Aadhaar database from GitHub
    const githubDatabaseUrl = 'https://raw.githubusercontent.com/<your-username>/<repository-name>/main/dummy_database.json';
    fetch(githubDatabaseUrl)
        .then(response => response.json())
        .then(data => {
            const isVerified = data.dummyAadhaars.includes(aadhaar);
            document.getElementById('aadhaar-result').innerText = isVerified 
                ? "Aadhaar verified successfully!" 
                : "Aadhaar verification failed!";
        })
        .catch(err => {
            console.error("Error fetching Aadhaar database:", err);
            document.getElementById('aadhaar-result').innerText = "Error verifying Aadhaar.";
        });
});

document.getElementById('start-camera').addEventListener('click', async () => {
    const webcamElement = document.getElementById('webcam');
    try {
        webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamElement.srcObject = webcamStream;
    } catch (err) {
        console.error("Error accessing webcam:", err);
        document.getElementById('face-result').innerText = "Could not access webcam.";
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
