// Function to save game data
function saveGame() {
  const gameData = {
    version: gVersion, // Add a version number to the save file
    money: money,
    inventory: inventory,
    boughtUpgrades: boughtUpgrades,
    raritiesDone: raritiesDone,
    // Add any new properties here
  };

  const json = JSON.stringify(gameData);
  const compressed = LZString.compressToUTF16(json); // Compress the JSON string
  const blob = new Blob([compressed], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "kediRNG_save.txt";
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

        // Check the version of the save file
        if (gameData.version !== gVersion) {
          alert("Old version detected, proceeding anyway...");
        }

        money = gameData.money || 0;
        inventory = gameData.inventory || defInventory;
        boughtUpgrades = gameData.boughtUpgrades || [];
        raritiesDone = gameData.raritiesDone || defRaritiesDone;

        // Load other properties here as needed

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
