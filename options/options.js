// Enter keypress event
document.getElementById('repoId').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        saveRepo();
    }
});
document.getElementById('saveButton').addEventListener('click', saveRepo);

chrome.storage.sync.get(['repoId'], function(result) {
    document.getElementById('repoId').value = result.repoId || '';
});
async function saveRepo() {
    // Get repoId value
    var repoId = document.getElementById('repoId').value;

    // Check if repoId is empty or undefined
    if (!repoId) {
        console.error('Repository ID is empty. Please enter a valid repository ID.');
        alert('Repository ID is empty. Please enter a valid repository ID.');
        return;
    }
    // Check if the repository exists
    try {
        const response = await fetch(`https://api.github.com/repos/${repoId}`);
        if (!response.ok) {
            throw new Error(`Repository not found: ${repoId}`);
        }
        
        // Save values to storage with a callback function
        chrome.storage.sync.set({ repoId: repoId }, function () {
            // Notify that the values were saved
            console.log('Repository details saved:', repoId);

            // Close the popup after the values are saved
            window.close();
        });
    } catch (error) {
        // Handle the error (e.g., show an alert)
        console.error('Error checking repository:', error.message);
        alert(`Error checking repository: ${error.message}`);
    }

}