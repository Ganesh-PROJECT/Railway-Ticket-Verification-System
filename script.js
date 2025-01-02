let model, webcamStream;

// Load the Teachable Machine model
async function loadModel() {
    model = await tf.loadLayersModel('model/model.json');
    console.log("Model loaded successfully!");
}

// Verify ID against the GitHub database
document.getElementById('verify-id').addEventListener('click', () => {
    const idInput = document.getElementById('id-input').value.trim();

    // Check if the ID format is valid
    if (!idInput) {
        document.getElementById('id-result').innerText = "Please enter a valid ID.";
        return;
    }

    // Fetch the IDs database from GitHub
    const githubDatabaseUrl = 'https://raw.githubusercontent.com/<your-username>/<repository-name>/main/ids_database.json';
    fetch(githubDatabaseUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load database.");
            }
            return response.json();
        })
        .then(data => {
            const isValidID = data.ids.includes(idInput);
            document.getElementById('id-result').innerText = isValidID 
                ? "ID verified successfully!"
                : "Invalid ID. Verification failed!";
        })
        .catch(error => {
            console.error("Error verifying ID:", error);
            document.getElementById('id-result').innerText = "Error verifying ID.";
        });
});

// Start webcam for face verification
document.getElementById('start-camera').addEventListener('click', async () => {
    const webcamElement = document.getElementById('webcam');
    try {
        webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamElement.srcObject = webcamStream;
    } catch (error) {
        console.error("Error accessing webcam:", error);
        document.getElementById('face-result').innerText = "Could not access the webcam.";
    }
});

// Perform face verification using Teachable Machine
document.getElementById('verify-face').addEventListener('click', async () => {
    if (!model) {
        document.getElementById('face-result').innerText = "Model not loaded. Please wait.";
        return;
    }

    const video = document.getElementById('webcam');
    const imageTensor = tf.browser.fromPixels(video).resizeBilinear([224, 224]).expandDims(0);
    const prediction = await model.predict(imageTensor).data();

    const verified = prediction[0] > prediction[1]; // Assuming class 0 is "Verified"
    document.getElementById('face-result').innerText = verified
        ? "Face verified successfully!"
        : "Face verification failed!";
});

// Load the Teachable Machine model on page load
loadModel();
