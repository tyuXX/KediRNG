// Function to save game data
function saveGame() {
  const gameData = {
    version: gVersion, // Add a version number to the save file
    money: money,
    allTimeMoney: allTimeMoney,
    inventory: inventory,
    boughtUpgrades: boughtUpgrades,
    raritiesDone: raritiesDone,
    quests: quests,
    // Add any new properties here
  };

  const json = JSON.stringify(gameData);
  const compressed = LZString.compressToUTF16(json); // Compress the JSON string
  const blob = new Blob([compressed], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "kediRNG(v" + gVersion + ").gsdsv";
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
          notify(
            "Old version detected (v" +
              gameData.version +
              "), proceeding anyway...",
            "red"
          );
        }

        money = gameData.money || 0;
        allTimeMoney = gameData.allTimeMoney || 0;
        inventory = gameData.inventory || defInventory;
        boughtUpgrades = gameData.boughtUpgrades || [];
        raritiesDone = gameData.raritiesDone || defRaritiesDone;
        quests = gameData.quests || [];

        // Load other properties here as needed

        displayInventory(); // Update UI
        displayUpgrades(); // Update UI
        notify("Game loaded successfully!", "green");
      } else {
        notify("Error loading game data: data is corrupted or invalid", "red");
      }
    } catch (error) {
      notify("Error loading game data:" + error, "red");
    }
  };

  reader.readAsText(file);
}

// Adding event listener to load input
document.getElementById("load-input").addEventListener("change", loadGame);

document.getElementById("saveButton").textContent += " (v" + gVersion + ")";
