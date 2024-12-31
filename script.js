document.getElementById('verify-aadhaar').addEventListener('click', () => {
    const aadhaar = document.getElementById('aadhaar').value.trim();

    // Check the format of the dummy Aadhaar number
    const isValidFormat = /^[2-9]{1}[0-9]{11}$/.test(aadhaar);

    if (!isValidFormat) {
        document.getElementById('result').innerText = "Invalid Dummy Aadhaar format!";
        return;
    }

    // Fetch the list of stored dummy Aadhaar numbers from GitHub
    fetch('dummy_database.json')
        .then(response => response.json())
        .then(data => {
            const isVerified = data.dummyAadhaars.includes(aadhaar);
            document.getElementById('result').innerText = isVerified 
                ? "Dummy Aadhaar verified successfully!" 
                : "Dummy Aadhaar verification failed!";
        })
        .catch(err => {
            console.error("Error fetching database:", err);
            document.getElementById('result').innerText = "Error verifying Dummy Aadhaar.";
        });
});
