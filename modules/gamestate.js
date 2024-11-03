// Function to save game data
function saveGame() {
    const gameData = {
      money: money,
      inventory: inventory,
      boughtUpgrades: boughtUpgrades,
      // Add other game state properties as needed
    };
  
    const json = JSON.stringify(gameData);
    const compressed = LZString.compressToUTF16(json); // Compress the JSON string
    const blob = new Blob([compressed], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'game_save.txt';
    link.click();
  }
  
  // Function to load game data
  function loadGame(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const compressedData = e.target.result;
        const json = LZString.decompressFromUTF16(compressedData); // Decompress the data
        if (json) {
          const gameData = JSON.parse(json);
          money = gameData.money;
          inventory = gameData.inventory;
          boughtUpgrades = gameData.boughtUpgrades;
          // Load other game state properties as needed
  
          displayInventory(); // Update UI
          displayUpgrades(); // Update UI
          console.log("Game loaded successfully!");
        } else {
          console.error("Error loading game data: data is corrupted or invalid");
        }
      } catch (error) {
        console.error("Error loading game data:", error);
      }
    };
  
    reader.readAsText(file);
  }
  

// Adding event listener to load input
document.getElementById("load-input").addEventListener("change", loadGame);
