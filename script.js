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
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load Aadhaar database.");
            }
            return response.json();
        })
        .then(data => {
            // Check if Aadhaar number exists in the database
            const isVerified = data.dummyAadhaars.hasOwnProperty(aadhaar);
            document.getElementById('aadhaar-result').innerText = isVerified
                ? "Aadhaar verified successfully!"
                : "Aadhaar verification failed!";
        })
        .catch(err => {
            console.error("Error verifying Aadhaar:", err);
            document.getElementById('aadhaar-result').innerText = "Error verifying Aadhaar.";
        });
});
