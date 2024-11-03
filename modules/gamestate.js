// Function to save the game state with compression
function saveGame() {
    const gameState = {
        inventory,
        boughtUpgrades,
        money,
        sellMultiplier,
    };

    // Convert to JSON and then compress using pako
    const jsonString = JSON.stringify(gameState);
    const compressedData = pako.deflate(jsonString, { to: 'string' }); // Compress data
    const blob = new Blob([compressedData], { type: 'application/octet-stream' }); // Create blob for download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'game-save.json.gz'; // Name of the download file
    link.click();
}

// Function to load the game state from a compressed file
function loadGame(event) {
    const file = event.target.files[0]; // Get the uploaded file

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const compressedData = new Uint8Array(e.target.result); // Read the file as binary
                const decompressedData = pako.inflate(compressedData, { to: 'string' }); // Decompress data
                const gameState = JSON.parse(decompressedData); // Parse the JSON data

                // Load data into the application
                inventory = gameState.inventory || [];
                boughtUpgrades = gameState.boughtUpgrades || [];
                money = gameState.money || 0;
                sellMultiplier = gameState.sellMultiplier || 1;

                displayInventory(); // Update the inventory display
                displayUpgrades(); // Update the shop display
                mlabel.innerHTML = `Money: ${money}`; // Update money label
                pmlabel.innerHTML = `Potential Money: ${inventory.reduce((a, b) => a + b.sell * sellMultiplier, 0)}`;
                tlabel.innerHTML = `Text Count: ${inventory.length}`;

                alert('Game loaded successfully!');
            } catch (error) {
                alert('Failed to load game data: ' + error.message);
            }
        };

        reader.readAsArrayBuffer(file); // Read the file as binary
    }
}
